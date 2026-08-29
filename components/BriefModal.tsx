"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { BriefConfig } from "@/lib/briefs";

type ButtonVariant = "primary" | "ghost" | "secondary";

type BriefModalProps = {
  config: BriefConfig;
  buttonLabel?: string;
  buttonVariant?: ButtonVariant;
  buttonClassName?: string;
};

type ContactValues = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  nip: string;
  customContactDateTime: string;
  additionalInfo: string;
  consent: boolean;
};

type ContactErrors = Partial<Record<keyof ContactValues | "preferredContactMethod" | "preferredContactTime" | "files", string>>;

const contactInitialState: ContactValues = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  nip: "",
  customContactDateTime: "",
  additionalInfo: "",
  consent: false
};

const preferredContactMethods = ["Telefon", "E-mail", "WhatsApp", "SMS", "Wszystko jedno"];
const preferredContactTimes = ["9:00-12:00", "12:00-16:00", "16:00-18:00", "Konkretna data i godzina"];
const maxFiles = 5;
const maxTotalFileSize = 12 * 1024 * 1024;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function validateContact(values: ContactValues, preferredContactMethod: string[], preferredContactTime: string[], files: File[]) {
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
  if (preferredContactTime.length === 0) errors.preferredContactTime = "Wybierz, kiedy najlepiej się odezwać.";
  if (preferredContactTime.includes("Konkretna data i godzina") && !values.customContactDateTime.trim()) {
    errors.customContactDateTime = "Wpisz preferowaną datę i godzinę kontaktu.";
  }

  if (!values.consent) errors.consent = "Zaakceptuj regulamin i zgodę na kontakt.";
  if (files.length > maxFiles) errors.files = `Możesz dodać maksymalnie ${maxFiles} plików.`;
  if (totalFileSize > maxTotalFileSize) errors.files = "Łączny rozmiar załączników nie może przekroczyć 12 MB.";

  return errors;
}

export function BriefModal({ config, buttonLabel, buttonVariant = "primary", buttonClassName = "" }: BriefModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [contact, setContact] = useState(contactInitialState);
  const [preferredContactMethod, setPreferredContactMethod] = useState<string[]>([]);
  const [preferredContactTime, setPreferredContactTime] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const contactStepIndex = config.steps.length;
  const isContactStep = stepIndex === contactStepIndex;
  const totalSteps = config.steps.length + 1;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);
  const showIntro = stepIndex === 0;
  const currentStep = config.steps[stepIndex];
  const activeStepSelectedOptions = currentStep ? answers[currentStep.question] ?? [] : [];
  const canGoNext = isContactStep || activeStepSelectedOptions.length > 0;
  const finalErrors = validateContact(contact, preferredContactMethod, preferredContactTime, files);
  const canSubmit = Object.keys(finalErrors).length === 0 && status !== "loading";
  const contactErrors = isContactStep || showErrors ? finalErrors : {};

  const buttonClasses: Record<ButtonVariant, string> = {
    primary: "button-glass bg-deal-gradient text-white shadow-glow hover:-translate-y-0.5 hover:shadow-card",
    ghost: "border border-ink/10 bg-white text-ink shadow-sm hover:border-electric/30 hover:text-electric",
    secondary: "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15"
  };

  const submittedAnswers = useMemo(
    () =>
      config.steps.map((step) => ({
        stepTitle: step.stepTitle,
        question: step.question,
        selectedOptions: answers[step.question] ?? []
      })).filter((answer) => answer.selectedOptions.length > 0),
    [answers, config.steps]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);
  }

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

  function toggleListValue(value: string, selected: string[], setter: (next: string[]) => void) {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  function toggleContactMethod(value: string) {
    if (value === "Wszystko jedno") {
      setPreferredContactMethod(preferredContactMethod.includes(value) ? [] : [value]);
      return;
    }

    const withoutAny = preferredContactMethod.filter((item) => item !== "Wszystko jedno");
    setPreferredContactMethod(withoutAny.includes(value) ? withoutAny.filter((item) => item !== value) : [...withoutAny, value]);
  }

  function updateContact<K extends keyof ContactValues>(name: K, value: ContactValues[K]) {
    setContact({ ...contact, [name]: value });
    if (status !== "idle") {
      setStatus("idle");
      setFeedback("");
    }
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
    setContact(contactInitialState);
    setPreferredContactMethod([]);
    setPreferredContactTime([]);
    setFiles([]);
    setShowErrors(false);
  }

  async function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowErrors(true);

    const errors = validateContact(contact, preferredContactMethod, preferredContactTime, files);

    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setFeedback("Uzupełnij zaznaczone pola kontaktowe.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    const formData = new FormData();
    formData.append("offerId", config.offerId);
    formData.append("offerTitle", config.offerTitle);
    formData.append("contact", JSON.stringify(contact));
    formData.append("preferredContactMethod", JSON.stringify(preferredContactMethod));
    formData.append("preferredContactTime", JSON.stringify(preferredContactTime));
    formData.append("customContactDateTime", contact.customContactDateTime);
    formData.append("answers", JSON.stringify(submittedAnswers));
    formData.append("sourceForm", "brief-modal");
    formData.append("sourceUrl", window.location.href);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/landing-leads", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(data.message ?? "Nie udało się wysłać briefu.");

      setStatus("success");
      setFeedback(data.message ?? "Dziękujemy — brief został wysłany. Skontaktujemy się z Tobą z konkretną strategią działania.");
      resetForm();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Nie udało się wysłać briefu.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cx(
          "relative isolate inline-flex min-h-11 items-center justify-center overflow-hidden rounded-md px-5 py-3 text-sm font-semibold transition",
          buttonClasses[buttonVariant],
          buttonClassName
        )}
      >
        <span className="relative z-10">{buttonLabel ?? config.cta}</span>
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div className={cx("fixed inset-0 z-[120] transition", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
              <div className={cx("absolute inset-0 bg-navy/55 backdrop-blur-sm transition-opacity", isOpen ? "opacity-100" : "opacity-0")} />
              <div className="absolute inset-x-3 top-4 mx-auto flex max-h-[calc(100dvh-2rem)] max-w-3xl flex-col overflow-hidden rounded-lg border border-white/50 bg-white shadow-glow transition sm:top-8 sm:max-h-[calc(100dvh-4rem)]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-mist px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">{config.offerTitle}</p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-navy sm:text-3xl">{status === "success" ? "Brief wysłany" : config.heading}</h2>
                  </div>
                  <button type="button" onClick={closeModal} className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-deal-gradient text-2xl leading-none text-white shadow-sm">
                    ×
                  </button>
                </div>

                {status === "success" ? (
                  <div className="overflow-y-auto px-5 py-6 sm:px-6">
                    <p className="rounded-lg border border-teal/20 bg-teal/10 p-5 text-base font-bold leading-7 text-teal">{feedback}</p>
                    <button type="button" onClick={closeModal} className="button-glass mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-deal-gradient px-6 py-3 text-sm font-bold text-white shadow-glow">
                      Zamknij
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitBrief} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                      {showIntro ? (
                        <div className="mb-5 border-b border-slate-200 pb-5">
                          <p className="text-sm leading-7 text-slate-600">{config.description}</p>
                          <p className="mt-3 text-sm font-bold leading-6 text-navy">{config.microcopy}</p>
                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-deal-gradient transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                            Krok {stepIndex + 1} z {totalSteps}
                          </p>
                        </div>
                      ) : null}
                      {isContactStep ? (
                        <ContactStep
                          values={contact}
                          errors={contactErrors}
                          preferredContactMethod={preferredContactMethod}
                          preferredContactTime={preferredContactTime}
                          files={files}
                          onValueChange={updateContact}
                          onMethodToggle={toggleContactMethod}
                          onTimeToggle={(value) => toggleListValue(value, preferredContactTime, setPreferredContactTime)}
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
                              const isSelected = (answers[currentStep.question] ?? []).includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => updateAnswer(option)}
                                  className={cx(
                                    "rounded-full border px-4 py-2 text-sm font-bold transition",
                                    isSelected ? "border-cyan bg-deal-gradient text-white shadow-sm" : "border-slate-200 bg-white text-navy hover:border-electric/30 hover:bg-electric/5"
                                  )}
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

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                        disabled={stepIndex === 0 || status === "loading"}
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-electric/30 hover:text-electric disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Wstecz
                      </button>
                      {isContactStep ? (
                        <button
                          type="submit"
                          disabled={!canSubmit}
                          className="button-glass inline-flex min-h-11 items-center justify-center rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {status === "loading" ? "Wysyłanie..." : "Wyślij brief do analizy"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStepIndex(Math.min(contactStepIndex, stepIndex + 1))}
                          disabled={!canGoNext}
                          className="button-glass inline-flex min-h-11 items-center justify-center rounded-md bg-deal-gradient px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Dalej
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

type ContactStepProps = {
  values: ContactValues;
  errors: ContactErrors;
  preferredContactMethod: string[];
  preferredContactTime: string[];
  files: File[];
  onValueChange: <K extends keyof ContactValues>(name: K, value: ContactValues[K]) => void;
  onMethodToggle: (value: string) => void;
  onTimeToggle: (value: string) => void;
  onFilesChange: (files: File[]) => void;
};

function ContactStep({ values, errors, preferredContactMethod, preferredContactTime, files, onValueChange, onMethodToggle, onTimeToggle, onFilesChange }: ContactStepProps) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan">Kontakt</p>
      <h3 className="mt-2 text-2xl font-black tracking-tight text-navy">Zostaw nam kontakt do siebie, zajmiemy się resztą!</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">Na podstawie Twoich odpowiedzi przygotujemy najlepszy kierunek działania i skontaktujemy się z konkretną strategią.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Imię i nazwisko" value={values.fullName} error={errors.fullName} onChange={(value) => onValueChange("fullName", value)} required />
        <Field label="Telefon" value={values.phone} error={errors.phone} onChange={(value) => onValueChange("phone", value)} required />
        <Field label="E-mail" type="email" value={values.email} error={errors.email} onChange={(value) => onValueChange("email", value)} required />
        <Field label="Nazwa firmy" value={values.companyName} onChange={(value) => onValueChange("companyName", value)} />
        <div>
          <Field label="NIP" value={values.nip} onChange={(value) => onValueChange("nip", value)} />
          <p className="mt-1 text-xs font-semibold text-slate-500">Opcjonalnie, ale przyspieszy analizę.</p>
        </div>
      </div>

      <ChipGroup title="Preferowana forma kontaktu" options={preferredContactMethods} selected={preferredContactMethod} error={errors.preferredContactMethod} onToggle={onMethodToggle} />
      <ChipGroup title="Kiedy najlepiej się odezwać?" options={preferredContactTimes} selected={preferredContactTime} error={errors.preferredContactTime} onToggle={onTimeToggle} />

      {preferredContactTime.includes("Konkretna data i godzina") ? (
        <Field label="Konkretna data i godzina kontaktu" value={values.customContactDateTime} onChange={(value) => onValueChange("customContactDateTime", value)} placeholder="Wpisz preferowaną datę i godzinę kontaktu" />
      ) : null}

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
          placeholder="Możesz dopisać coś od siebie — albo zostawić puste, jeśli wszystko już zaznaczyłeś."
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

function Field({ label, value, onChange, error, type = "text", required, placeholder }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; required?: boolean; placeholder?: string }) {
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
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cx(
          "mt-2 h-12 w-full rounded-md border px-4 text-sm outline-none transition hover:border-slate-400 focus:border-electric focus:ring-4 focus:ring-electric/10",
          error ? "border-cyan bg-cyan/5 ring-4 ring-cyan/10" : "border-slate-300"
        )}
      />
      {error ? <p className="mt-2 text-xs font-semibold text-teal">{error}</p> : null}
    </label>
  );
}
