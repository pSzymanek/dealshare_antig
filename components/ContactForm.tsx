"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: ""
};

type FormValues = typeof initialState;
type FieldName = keyof FormValues;
type Errors = Partial<Record<FieldName, string>>;

function validate(values: FormValues) {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = "Podaj imię i nazwisko.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Podaj poprawny adres e-mail.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Wiadomość musi mieć minimum 10 znaków.";
  }

  return errors;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const errors = showErrors ? validate(values) : {};

  function updateValue(name: FieldName, value: string) {
    setValues({ ...values, [name]: value });

    if (status === "success") {
      setStatus("idle");
      setFeedback("");
    }
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowErrors(true);

    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFeedback("Popraw zaznaczone pola formularza.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Nie udało się wysłać wiadomości.");
      }

      setStatus("success");
      setFeedback(data.message ?? "Dziękujemy. Wiadomość została wysłana.");
      setValues(initialState);
      setShowErrors(false);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Nie udało się wysłać wiadomości.");
    }
  }

  return (
    <form id="formularz" onSubmit={submitForm} className="card-glass scroll-mt-28 rounded-lg border border-slate-200/90 bg-white p-6 shadow-card transition hover:border-slate-300 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Imię i nazwisko" name="name" value={values.name} error={errors.name} onChange={(value) => updateValue("name", value)} required />
        <Field label="E-mail" name="email" type="email" value={values.email} error={errors.email} onChange={(value) => updateValue("email", value)} required />
        <Field label="Telefon" name="phone" value={values.phone} onChange={(value) => updateValue("phone", value)} />
        <Field label="Nazwa firmy" name="company" value={values.company} onChange={(value) => updateValue("company", value)} />
      </div>
      <label className="mt-5 block">
        <span className="flex items-center gap-2 text-sm font-bold text-navy">
          Opisz krótko sytuację
          {errors.message ? <ErrorMark /> : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">Napisz, czego firma potrzebuje, co już wiesz i jaki efekt chcesz osiągnąć.</span>
        <textarea
          name="message"
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cx(
            "mt-2 min-h-36 w-full rounded-md border px-4 py-3 text-sm outline-none transition duration-200 hover:border-slate-400 focus:border-cyan focus:ring-4 focus:ring-cyan/15",
            errors.message ? "border-cyan bg-cyan/5 ring-4 ring-cyan/10" : "border-slate-300"
          )}
          required
        />
        {errors.message ? <p id="message-error" className="mt-2 text-xs font-semibold text-teal">{errors.message}</p> : null}
      </label>
      {status === "success" ? (
        <p className="mt-5 rounded-md border border-teal/30 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal">
          ✓ {feedback}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-5 rounded-md border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm font-semibold text-navy">
          ! {feedback}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="button-glass relative isolate mt-6 inline-flex min-h-12 items-center justify-center overflow-hidden rounded-md bg-deal-gradient px-8 py-3 text-sm font-black text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Wysyłanie..." : "Wyślij wiadomość →"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
};

function Field({ label, name, value, error, onChange, required, type = "text" }: FieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold text-navy">
        {label}
        {error ? <ErrorMark /> : null}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        required={required}
        className={cx(
          "mt-2 h-12 w-full rounded-md border px-4 text-sm outline-none transition duration-200 hover:border-slate-400 focus:border-cyan focus:ring-4 focus:ring-cyan/15",
          error ? "border-cyan bg-cyan/5 ring-4 ring-cyan/10" : "border-slate-300"
        )}
      />
      {error ? <p id={errorId} className="mt-2 text-xs font-semibold text-teal">{error}</p> : null}
    </label>
  );
}

function ErrorMark() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-cyan bg-cyan/10 text-xs font-black leading-none text-teal">
      !
    </span>
  );
}
