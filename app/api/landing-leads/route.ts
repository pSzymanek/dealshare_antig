import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type LandingAnswer = {
  stepTitle?: string;
  question?: string;
  selectedOptions?: string[];
};

type LandingContact = {
  fullName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  nip?: string;
  additionalInfo?: string;
  consent?: boolean;
};

const contactEmail = process.env.CONTACT_TO_EMAIL ?? "biuro@dealshare.pl";
const maxFiles = 5;
const maxTotalFileSize = 12 * 1024 * 1024;
const allowedFileExtensions = new Set(["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"]);

function clean(value?: string) {
  return value?.trim() ?? "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string") return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function list(values?: string[]) {
  const cleanValues = values?.map((value) => clean(value)).filter(Boolean) ?? [];
  return cleanValues.length ? cleanValues : ["Nie podano"];
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^\w.\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, "_").slice(0, 140) || "zalacznik";
}

function createMailer() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM ?? contactEmail;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return {
    smtpFrom,
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })
  };
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const offerId = clean(String(formData.get("offerId") ?? ""));
  const offerTitle = clean(String(formData.get("offerTitle") ?? ""));
  const sourceUrl = clean(String(formData.get("sourceUrl") ?? ""));
  const sourceForm = clean(String(formData.get("sourceForm") ?? ""));
  const contact = parseJsonField<LandingContact>(formData.get("contact"), {});
  const preferredContactMethod = parseJsonField<string[]>(formData.get("preferredContactMethod"), []);
  const preferredContactTime = parseJsonField<string[]>(formData.get("preferredContactTime"), []);
  const customContactDateTime = clean(String(formData.get("customContactDateTime") ?? ""));
  const answers = parseJsonField<LandingAnswer[]>(formData.get("answers"), []);
  const fullName = clean(contact.fullName);
  const phone = clean(contact.phone);
  const email = clean(contact.email);
  const companyName = clean(contact.companyName) || "Nie podano";
  const nip = clean(contact.nip) || "Nie podano";
  const additionalInfo = clean(contact.additionalInfo) || "Brak dodatkowych informacji.";
  const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
  const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

  if (!fullName || !phone || !isValidEmail(email) || preferredContactMethod.length === 0 || contact.consent !== true) {
    return NextResponse.json({ message: "Uzupełnij dane kontaktowe, preferowany kontakt oraz zgodę regulaminową." }, { status: 400 });
  }

  if (files.length > maxFiles || totalFileSize > maxTotalFileSize) {
    return NextResponse.json({ message: "Załącz maksymalnie 5 plików o łącznym rozmiarze do 12 MB." }, { status: 400 });
  }

  for (const file of files) {
    if (!allowedFileExtensions.has(getFileExtension(file.name))) {
      return NextResponse.json({ message: "Dozwolone formaty załączników: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX." }, { status: 400 });
    }
  }

  const mailer = createMailer();

  if (!mailer) {
    return NextResponse.json({ message: "Formularz będzie dostępny już wkrótce." }, { status: 503 });
  }

  const sentAt = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
  const filteredAnswers = answers.filter((answer) => (answer.selectedOptions ?? []).some((option) => clean(option)));
  const attachmentSummary = files.length ? files.map((file) => `${file.name} (${Math.round(file.size / 1024)} KB)`).join(", ") : "Nie załączono plików";
  const consentText = "Użytkownik zaakceptował regulamin i wyraził zgodę na przetwarzanie danych z formularza oraz kontakt telefoniczny, mailowy, SMS lub przez komunikator w celu obsługi zgłoszenia.";

  const sourceLabel = sourceForm === "brief-modal" ? "popup briefu" : sourceForm === "brief-inline" ? "formularz na stronie oferty" : "landing page";

  const text = [
    "Nowe zgłoszenie z landing page Dealshare",
    "",
    "Oferta:",
    `Nazwa oferty: ${offerTitle || "Nie podano"}`,
    `ID oferty: ${offerId || "Nie podano"}`,
    "",
    "Dane kontaktowe:",
    `Imię i nazwisko: ${fullName}`,
    `Telefon: ${phone}`,
    `E-mail: ${email}`,
    `Nazwa firmy: ${companyName}`,
    `NIP: ${nip}`,
    "",
    "Preferowany kontakt:",
    preferredContactMethod.join(", "),
    "",
    "Preferowany termin kontaktu:",
    preferredContactTime.length ? preferredContactTime.join(", ") : "Nie podano",
    ...(customContactDateTime ? ["Konkretna data/godzina:", customContactDateTime] : []),
    "",
    "Informacje z formularza:",
    ...filteredAnswers.flatMap((answer) => [
      "",
      clean(answer.stepTitle) || "Pytanie",
      `Pytanie: ${clean(answer.question) || "Nie podano"}`,
      "Odpowiedzi:",
      ...list(answer.selectedOptions).map((option) => `- ${option}`)
    ]),
    "",
    "Dodatkowe informacje:",
    additionalInfo,
    "",
    "Załączniki:",
    attachmentSummary,
    "",
    "Zgoda:",
    consentText,
    "",
    "Informacje techniczne:",
    `Typ formularza: ${sourceLabel}`,
    `Data wysłania: ${sentAt}`,
    `Adres strony / źródło formularza: ${sourceUrl || "Nie podano"}`
  ].join("\n");

  const answerHtml = filteredAnswers
    .map((answer) => {
      const selectedOptions = list(answer.selectedOptions)
        .map((option) => `<li>${escapeHtml(option)}</li>`)
        .join("");

      return `
        <div style="margin:18px 0;padding:14px 16px;border:1px solid #dbe4ef;border-radius:10px;">
          <p style="margin:0 0 6px;color:#00a8b8;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(clean(answer.stepTitle) || "Pytanie")}</p>
          <p style="margin:0 0 10px;font-weight:800;color:#001f4d;">${escapeHtml(clean(answer.question) || "Nie podano")}</p>
          <ul style="margin:0;padding-left:20px;">${selectedOptions}</ul>
        </div>
      `;
    })
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#10233f;line-height:1.55;max-width:760px;">
      <h1 style="margin:0 0 18px;color:#001f4d;">Nowe zgłoszenie z landing page Dealshare</h1>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Oferta</h2>
      <p><strong>Nazwa oferty:</strong> ${escapeHtml(offerTitle || "Nie podano")}</p>
      <p><strong>ID oferty:</strong> ${escapeHtml(offerId || "Nie podano")}</p>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Dane kontaktowe</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #dbe4ef;">
        <tr><td style="border:1px solid #dbe4ef;"><strong>Imię i nazwisko</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>Telefon</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(phone)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>E-mail</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(email)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>Nazwa firmy</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(companyName)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>NIP</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(nip)}</td></tr>
      </table>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Preferowany kontakt</h2>
      <p>${escapeHtml(preferredContactMethod.join(", "))}</p>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Preferowany termin kontaktu</h2>
      <p>${escapeHtml(preferredContactTime.length ? preferredContactTime.join(", ") : "Nie podano")}</p>
      ${customContactDateTime ? `<p><strong>Konkretna data/godzina:</strong> ${escapeHtml(customContactDateTime)}</p>` : ""}
      <h2 style="margin:24px 0 8px;color:#001f4d;">Informacje z formularza</h2>
      ${answerHtml || "<p>Nie podano dodatkowych odpowiedzi.</p>"}
      <h2 style="margin:24px 0 8px;color:#001f4d;">Dodatkowe informacje</h2>
      <p>${escapeHtml(additionalInfo).replace(/\n/g, "<br />")}</p>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Załączniki</h2>
      <p>${escapeHtml(attachmentSummary)}</p>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Zgoda</h2>
      <p>${escapeHtml(consentText)}</p>
      <h2 style="margin:24px 0 8px;color:#001f4d;">Informacje techniczne</h2>
      <p><strong>Typ formularza:</strong> ${escapeHtml(sourceLabel)}</p>
      <p><strong>Data wysłania:</strong> ${escapeHtml(sentAt)}</p>
      <p><strong>Adres strony / źródło formularza:</strong> ${escapeHtml(sourceUrl || "Nie podano")}</p>
    </div>
  `;

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: safeFileName(file.name),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined
    }))
  );

  try {
    await mailer.transporter.sendMail({
      from: mailer.smtpFrom,
      to: contactEmail,
      replyTo: email,
      subject: `[Dealshare] ${sourceLabel}: ${offerTitle || offerId || "zgłoszenie"} — ${fullName}`,
      text,
      html,
      attachments
    });

    return NextResponse.json({ message: "Dziękujemy. Otrzymaliśmy zgłoszenie i skontaktujemy się w sprawie kolejnego kroku." });
  } catch {
    return NextResponse.json({ message: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie później." }, { status: 500 });
  }
}
