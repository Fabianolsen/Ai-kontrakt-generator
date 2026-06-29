"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield } from "lucide-react";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [navn, setNavn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("mode") === "register") setMode("register");
  }, [searchParams]);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: navn } },
        });
        if (error) throw error;
        setSuccess("Sjekk e-posten din for å bekrefte kontoen.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#F8F7F4" }}
    >
      <Link href="/" className="font-display text-2xl font-bold mb-8" style={{ color: "#0F1F3D" }}>
        Avtalio
      </Link>

      <div
        className="w-full max-w-md bg-white border border-gray-100 p-8 shadow-sm"
        style={{ borderRadius: "8px" }}
      >
        <h1
          className="font-display text-2xl font-bold mb-1 text-center"
          style={{ color: "#0F1F3D" }}
        >
          {mode === "login" ? "Logg inn" : "Opprett konto"}
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          {mode === "login"
            ? "Velkommen tilbake"
            : "Gratis — ingen kredittkort nødvendig"}
        </p>

        {/* Tab toggle */}
        <div
          className="flex border border-gray-200 p-1 mb-6"
          style={{ borderRadius: "8px" }}
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 text-sm font-medium transition-colors"
              style={{
                borderRadius: "6px",
                background: mode === m ? "#0F1F3D" : "transparent",
                color: mode === m ? "#fff" : "#6b7280",
              }}
            >
              {m === "login" ? "Logg inn" : "Registrer"}
            </button>
          ))}
        </div>

        {error && (
          <div
            className="text-sm px-4 py-3 mb-4 bg-red-50 border border-red-200 text-red-700"
            style={{ borderRadius: "8px" }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="text-sm px-4 py-3 mb-4 bg-green-50 border border-green-200 text-green-700"
            style={{ borderRadius: "8px" }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <FormField label="Fullt navn">
              <input
                type="text"
                value={navn}
                onChange={(e) => setNavn(e.target.value)}
                required
                placeholder="Ola Nordmann"
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
                style={{ borderRadius: "8px" }}
              />
            </FormField>
          )}
          <FormField label="E-post">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ola@eksempel.no"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
              style={{ borderRadius: "8px" }}
            />
          </FormField>
          <FormField label="Passord">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Minst 8 tegn"
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
              style={{ borderRadius: "8px" }}
            />
          </FormField>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#0F1F3D", borderRadius: "8px" }}
          >
            {loading ? "Laster…" : mode === "login" ? "Logg inn" : "Opprett konto"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs">eller</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:border-gray-300 flex items-center justify-center gap-3 transition-colors"
          style={{ borderRadius: "8px" }}
        >
          <GoogleIcon />
          Fortsett med Google
        </button>

        <div
          className="flex items-center gap-2 mt-6 px-4 py-3 bg-gray-50 border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <Shield className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-400">
            Dataene dine krypteres og lagres sikkert med Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
