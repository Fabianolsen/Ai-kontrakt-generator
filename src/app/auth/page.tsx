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
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4">
      <Link href="/" className="font-display text-3xl font-bold text-white mb-8">
        Avtalio
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex border border-gray-200 rounded-xl p-1 mb-8">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "login" ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-900"
            }`}
          >
            Logg inn
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "register" ? "bg-navy-800 text-white" : "text-navy-500 hover:text-navy-900"
            }`}
          >
            Registrer
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Fullt navn</label>
              <input
                type="text"
                value={navn}
                onChange={(e) => setNavn(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
                placeholder="Ola Nordmann"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">E-post</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
              placeholder="ola@eksempel.no"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Passord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
              placeholder="Minst 8 tegn"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 hover:bg-navy-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Laster..." : mode === "login" ? "Logg inn" : "Opprett konto"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">eller</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-gray-200 hover:border-gray-300 text-navy-700 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Fortsett med Google
        </button>

        <div className="flex items-center gap-2 mt-6 p-4 bg-gray-50 rounded-xl">
          <Shield className="w-4 h-4 text-navy-400 flex-shrink-0" />
          <p className="text-xs text-navy-400">Dataene dine er kryptert og sikret med Supabase.</p>
        </div>
      </div>
    </div>
  );
}
