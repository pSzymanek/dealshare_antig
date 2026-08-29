"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { BriefConfig } from "@/lib/briefs";

type BriefInlineFormProps = {
  config: BriefConfig;
  title: string;
  text: string;
};

type ContactValues = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  nip: string;
  additionalInfo: string;
  consent: boolean;
};

type ContactErrors = Partial<Record<keyof ContactValues | "preferredContactMethod" | "files", string>>;

const initialContact: ContactValues = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  nip: "",
  additionalInfo: "",
  consent: false
};

const preferredContactMethods = ["Telefon", "E-mail", "SMS", "WhatsApp", "Wszystko jedno"];
const maxFiles = 5;
const maxTotalFileSize = 12 * 1024 * 1024;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function validateContact(values: ContactValues, preferredContactMethod: string[], files: File[]) {
  const errors: ContactErrors = {};
  const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

  if (!values.fullName.trim()) errors.fullName = "Wpisz imię i nazwisko.";
  if (!values.phone.trim()) errors.phone = "Wpisz numer telefonu.";
  if (!values.email.trim()) {
    errors.email = "Wpisz adres e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Wpisz poprawny adres e-mail.";
  }
  if (preferredContactMethod.length === 0) errors.preferredContactMethod = "Wybierz przynajmniej jedną formę kontaktu.";
  if (!values.consent) errors.consent = "Zaakceptuj regulamin i zgodę na kontakt.";
  if (files.length > maxFiles) errors.files = `Możesz dodać maksymalnie ${maxFiles} plików.`;
  if (totalFileSize > maxTotalFileSize) errors.files = "Łączny rozmiar załączników nie może przekroczyć 12 MB.";

  return errors;
}

export function BriefInlineForm({ config, title, text }: BriefInlineFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [contact, setContact] = useState(initialContact);
  const [preferredContactMethod, setPreferredContactMethod] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const contactStepIndex = config.steps.length;
  const isContactStep = stepIndex === contactStepIndex;
  const totalSteps = config.steps.length + 1;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const currentStep = config.steps[stepIndex];
  const activeSelectedOptions = currentStep ? answers[currentStep.question] ?? [] : [];
  const canGoNext = isContactStep || activeSelectedOptions.length > 0;
  const errors = showErrors ? validateContact(contact, preferredContactMethod, files) : {};

  const submittedAnswers = useMemo(
    () =>
      config.steps
        .map((step) => ({
          stepTitle: step.stepTitle,
          question: step.question,
          selectedOptions: answers[step.question] ?? []
        }))
        .filter((answer) => answer.selectedOptions.length > 0),
    [answers, config.steps]
  );

  function updateAnswer(option: string) {
    if (!currentStep) return;

    const selected = answers[currentStep.question] ?? [];

    if (currentStep.type === "single") {
      setAnswers({ ...answers, [currentStep.question]: [option] });
      return;
    }

    setAnswers({
      ...answers,
      [currentStep.question]: selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]
    });
  }

  function updateContact<K extends keyof ContactValues>(name: K, value: ContactValues[K]) {
    setContact({ ...contact, [name]: value });
    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  }

  function toggleContactMethod(value: string) {
    if (value === "Wszystko jedno") {
      setPreferredContactMethod(preferredContactMethod.includes(value) ? [] : [value]);
      return;
    }

    const withoutAny = preferredContactMethod.filter((item) => item !== "Wszystko jedno");
    setPreferredContactMethod(withoutAny.includes(value) ? withoutAny.filter((item) => item !== value) : [...withoutAny, value]);
  }

  function updateFiles(nextFiles: File[]) {
    setFiles(nextFiles);
    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
  }

  function resetForm() {
    setStepIndex(0);
    setAnswers({});
    setContact(initialContact);
    setPreferredContactMethod([]);
    setFiles([]);
    setShowErrors(false);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowErrors(true);

    const nextErrors = validateContact(contact, preferredContactMethod, files);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFeedback("Uzupełnij zaznaczone pola kontaktowe.");
      return;
    }

    const formData = new FormData();
    formData.append("offerId", config.offerId);
    formData.append("offerTitle", config.offerTitle);
    formData.append("contact", JSON.stringify(contact));
    formData.append("preferredContactMethod", JSON.stringify(preferredContactMethod));
    formData.append("answers", JSON.stringify(submittedAnswers));
    formData.append("sourceForm", "brief-inline");
    formData.append("sourceUrl", window.location.href);
    files.forEach((file) => formData.append("files", file));

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/landing-leads", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(data.message ?? "Nie udało się wysłać zgłoszenia.");

      setStatus("success");
      setFeedback(data.message ?? "Dziękujemy. Otrzymaliśmy zgłoszenie i skontaktujemy się w sprawie kolejnego kroku.");
      resetForm();
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Nie udało się wysłać zgłoszenia.");
    }
  }

  return (
    <section id="formularz" className="scroll-mt-28 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="reveal-on-scroll rounded-lg border border-electric/15 bg-mist p-6 shadow-sm lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Kontakt</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">{title}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{text}</p>
            <div className="mt-6 rounded-lg border border-white bg-white/70 p-4 text-sm font-semibold leading-7 text-slate-700">
              Przejdziesz przez kilka krótkich ekranów, a na końcu zostawisz kontakt i opcjonalne załączniki.
            </div>
          </div>

          <form onSubmit={submitForm} className="reveal-on-scroll flex min-h-[560px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-card sm:p-7" noValidate>
            <div className="border-b border-slate-200 pb-5">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-deal-gradient transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Krok {stepIndex + 1} z {totalSteps}
              </p>
            </div>

            <div className="flex-1 py-6">
              {status === "success" ? (
                <div className="rounded-lg border border-teal/20 bg-teal/10 p-5 text-base font-bold leading-7 text-teal">{feedback}</div>
              ) : isContactStep ? (
                <ContactStep
                  values={contact}
                  errors={errors}
                  preferredContactMethod={preferredContactMethod}
                  files={files}
                  onValueChange={updateContact}
                  onMethodToggle={toggleContactMethod}
                  onFilesChange={updateFiles}
                />
              ) : currentStep ? (
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">{currentStep.stepTitle}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-navy">{currentStep.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{currentStep.type === "single" ? "Wybierz jedną odpowiedź." : "Możesz wybrać kilka odpowiedzi."}</p>
                  {!canGoNext ? <p className="mt-3 text-sm font-bold text-teal">Wybierz przynajmniej jedną odpowiedź, żeby przejść dalej.</p> : null}
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {currentStep.options.map((option) => {
                      const isSelected = activeSelectedOptions.includes(option);

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateAnswer(option)}
                          className={cx("rounded-full border px-4 py-2 text-sm font-bold transition", isSelected ? "border-cyan bg-deal-gradient text-white shadow-sm" : "border-slate-200 bg-white text-navy hover:border-electric/30 hover:bg-electric/5")}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {status === "error" ? <p className="mt-5 rounded-md border border-electric/20 bg-electric/10 px-4 py-3 text-sm font-semibold text-electric">{feedback}</p> : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                disabled={stepIndex === 0 || status === "loading" || status === "success"}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-electric/30 hover:text-electric disabled:cursor-not-allowed disabled:opacity-40"
              >
                Wstecz
              </button>

              {status === "success" ? null : isContactStep ? (
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="button-glass inline-flex min-h-11 items-center justify-center rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? "Wysyłanie..." : "Wyślij zgłoszenie"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStepIndex(Math.min(contactStepIndex, stepIndex + 1))}
                  disabled={!canGoNext}
                  className="button-glass inline-flex min-h-11 items-center justify-center rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Dalej
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

type ContactStepProps = {
  values: ContactValues;
  errors: ContactErrors;
  preferredContactMethod: string[];
  files: File[];
  onValueChange: <K extends keyof ContactValues>(name: K, value: ContactValues[K]) => void;
  onMethodToggle: (value: string) => void;
  onFilesChange: (files: File[]) => void;
};

function ContactStep({ values, errors, preferredContactMethod, files, onValueChange, onMethodToggle, onFilesChange }: ContactStepProps) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Kontakt</p>
      <h3 className="mt-2 text-2xl font-black tracking-tight text-navy">Zostaw nam kontakt do siebie, zajmiemy się resztą.</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">Dołącz dokumenty, jeżeli mogą przyspieszyć analizę. Jeśli nie masz ich pod ręką, formularz możesz wysłać bez załączników.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Imię i nazwisko" value={values.fullName} error={errors.fullName} onChange={(value) => onValueChange("fullName", value)} required />
        <Field label="Telefon" value={values.phone} error={errors.phone} onChange={(value) => onValueChange("phone", value)} required />
        <Field label="E-mail" type="email" value={values.email} error={errors.email} onChange={(value) => onValueChange("email", value)} required />
        <Field label="Nazwa firmy" value={values.companyName} onChange={(value) => onValueChange("companyName", value)} />
        <div>
          <Field label="NIP" value={values.nip} onChange={(value) => onValueChange("nip", value)} />
          <p className="mt-1 text-xs font-semibold text-slate-500">Opcjonalnie, ale może przyspieszyć analizę.</p>
        </div>
      </div>

      <ChipGroup title="Preferowana forma kontaktu" options={preferredContactMethods} selected={preferredContactMethod} error={errors.preferredContactMethod} onToggle={onMethodToggle} />

      <label className="mt-5 block">
        <span className="text-sm font-bold text-navy">Załączniki</span>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
          onChange={(event) => onFilesChange(Array.from(event.target.files ?? []))}
          className="mt-2 block w-full rounded-md border border-slate-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-electric file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:border-slate-400 focus:border-electric focus:ring-4 focus:ring-electric/10"
        />
        <span className="mt-2 block text-xs font-semibold text-slate-500">Maksymalnie 5 plików, łącznie do 12 MB. PDF, JPG, PNG, DOC, DOCX, XLS, XLSX.</span>
        {files.length ? <span className="mt-2 block text-xs font-semibold text-slate-500">Wybrane pliki: {files.map((file) => file.name).join(", ")}</span> : null}
        {errors.files ? <p className="mt-2 text-xs font-semibold text-teal">{errors.files}</p> : null}
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-bold text-navy">Dodatkowe informacje</span>
        <textarea
          value={values.additionalInfo}
          onChange={(event) => onValueChange("additionalInfo", event.target.value)}
          placeholder="Możesz dopisać, co jest najważniejsze w Twojej sytuacji."
          className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition hover:border-slate-400 focus:border-electric focus:ring-4 focus:ring-electric/10"
        />
      </label>

      <label className="mt-5 flex items-start gap-3 rounded-lg border border-slate-200 bg-mist/70 p-4 text-sm leading-6 text-slate-700">
        <input type="checkbox" checked={values.consent} onChange={(event) => onValueChange("consent", event.target.checked)} className="mt-1 h-4 w-4 accent-electric" required />
        <span>
          Akceptuję{" "}
          <Link href="/regulamin#formularze-i-zgody" className="font-bold text-electric underline underline-offset-4">
            regulamin
          </Link>{" "}
          i wyrażam zgodę na przetwarzanie danych z formularza oraz kontakt ze strony Dealshare telefonicznie, mailowo, SMS-em lub przez komunikator w celu obsługi zgłoszenia.
        </span>
      </label>
      {errors.consent ? <p className="mt-2 text-xs font-semibold text-teal">{errors.consent}</p> : null}
    </div>
  );
}

function ChipGroup({ title, options, selected, error, onToggle }: { title: string; options: string[]; selected: string[]; error?: string; onToggle: (value: string) => void }) {
  return (
    <div className="mt-6">
      <p className="text-sm font-bold text-navy">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cx("rounded-full border px-4 py-2 text-sm font-bold transition", isSelected ? "border-cyan bg-deal-gradient text-white shadow-sm" : "border-slate-200 bg-white text-navy hover:border-electric/30 hover:bg-electric/5")}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-xs font-semibold text-teal">{error}</p> : null}
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", required }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy">
        {label}
        {required ? <span className="text-cyan"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cx(
          "mt-2 h-12 w-full rounded-md border px-4 text-sm outline-none transition hover:border-slate-400 focus:border-electric focus:ring-4 focus:ring-electric/10",
          error ? "border-cyan bg-cyan/5 ring-4 ring-cyan/10" : "border-slate-300"
        )}
        required={required}
      />
      {error ? <p className="mt-2 text-xs font-semibold text-teal">{error}</p> : null}
    </label>
  );
}
