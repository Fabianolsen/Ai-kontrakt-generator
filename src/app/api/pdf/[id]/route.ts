import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });

  const { data: kontrakt } = await supabase
    .from("kontrakter")
    .select("innhold, data")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!kontrakt) return NextResponse.json({ error: "Ikke funnet" }, { status: 404 });

  // Generate PDF using puppeteer
  const puppeteer = await import("puppeteer");
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    const html = `<!DOCTYPE html>
<html lang="nb">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a2e;
      padding: 40px 60px;
    }
    h1 {
      font-size: 20pt;
      text-align: center;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .subtitle {
      text-align: center;
      color: #666;
      font-size: 10pt;
      margin-bottom: 32px;
      border-bottom: 2px solid #1a1a2e;
      padding-bottom: 16px;
    }
    pre {
      white-space: pre-wrap;
      font-family: 'Georgia', serif;
      font-size: 10.5pt;
      line-height: 1.7;
    }
    @page { margin: 20mm 25mm; }
  </style>
</head>
<body>
  <pre>${kontrakt.innhold.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "25mm", right: "25mm" },
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
