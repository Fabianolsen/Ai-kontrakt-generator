import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });

  const { data: contract } = await supabase
    .from("contracts")
    .select("generated_text, form_data")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!contract) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });

  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    const escaped = contract.generated_text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const html = `<!DOCTYPE html>
<html lang="nb">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=Inter:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 11.5pt;
      line-height: 1.75;
      color: #0F1F3D;
    }
    .watermark-header {
      text-align: center;
      border-bottom: 2px solid #C9A84C;
      padding-bottom: 12px;
      margin-bottom: 28px;
    }
    .watermark-header .brand {
      font-size: 13pt;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #0F1F3D;
    }
    .watermark-header .tagline {
      font-size: 9pt;
      color: #6b7280;
      margin-top: 2px;
    }
    pre {
      white-space: pre-wrap;
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 11pt;
      line-height: 1.8;
    }
    @page {
      size: A4;
      margin: 22mm 28mm;
    }
  </style>
</head>
<body>
  <div class="watermark-header">
    <div class="brand">Avtalio</div>
    <div class="tagline">Generert via avtalio.no — Basert på husleieloven av 1999</div>
  </div>
  <pre>${escaped}</pre>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="leiekontrakt-${params.id.slice(0, 8)}.pdf"`,
      },
    });
  } finally {
    await browser.close();
  }
}
