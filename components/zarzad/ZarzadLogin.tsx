"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { createZarzadSupabaseClient } from "@/lib/zarzad-supabase";

export function ZarzadLogin({ onSignedIn }: { onSignedIn?: () => void }) {
  const router = useRouter();
  const supabase = useMemo(() => createZarzadSupabaseClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage("Nieprawidłowy e-mail albo hasło.");
      setIsSubmitting(false);
      return;
    }

    onSignedIn?.();
    router.push("/zarzad");
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-navy-gradient px-5 py-10 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/14 bg-white/10 p-6 shadow-glow backdrop-blur">
        <div className="flex items-center gap-4">
          <Image src="/sygnet-white.png" alt="" width={52} height={52} className="h-12 w-12 object-contain" priority />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">dealshare board</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight">Logowanie</h1>
          </div>
        </div>

        <label className="mt-8 block">
          <span className="text-sm font-bold text-white/80">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-white/16 bg-white px-4 text-base font-semibold text-navy outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/20"
            autoComplete="email"
            required
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-white/80">Hasło</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-md border border-white/16 bg-white px-4 text-base font-semibold text-navy outline-none transition focus:border-cyan focus:ring-4 focus:ring-cyan/20"
            autoComplete="current-password"
            required
          />
        </label>

        {message ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</p> : null}

        <button type="submit" disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-md bg-white px-5 text-sm font-black text-navy transition hover:bg-cyan disabled:cursor-not-allowed disabled:opacity-65">
          {isSubmitting ? "Logowanie..." : "Wejdź do panelu"}
        </button>
      </form>
    </main>
  );
}
