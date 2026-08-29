import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  needCategory?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

type BriefAnswer = {
  stepTitle?: string;
  question?: string;
  selectedOptions?: string[];
};

type BriefPayload = {
  type?: "brief";
  offerId?: string;
  offerTitle?: string;
  answers?: BriefAnswer[];
  contact?: {
    fullName?: string;
    phone?: string;
    email?: string;
    companyName?: string;
    nip?: string;
  };
  preferredContactMethod?: string[];
  preferredContactTime?: string[];
  customContactDateTime?: string;
  additionalInfo?: string;
  sourceUrl?: string;
};

type ClosedOfferNotifyPayload = {
  type?: "closed-offer-notify";
  offerId?: string;
  offerTitle?: string;
  email?: string;
  consent?: boolean;
  sourceUrl?: string;
};

const contactEmail = process.env.CONTACT_TO_EMAIL ?? "biuro@dealshare.pl";

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

function list(values?: string[]) {
  const cleanValues = values?.map((value) => clean(value)).filter(Boolean) ?? [];
  return cleanValues.length ? cleanValues : ["Nie podano"];
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

function buildBriefEmail(payload: BriefPayload) {
  const offerTitle = clean(payload.offerTitle) || "Nie podano";
  const offerId = clean(payload.offerId) || "Nie podano";
  const isPartnerOffer = clean(payload.offerId) === "dodaj-oferte";
  const emailHeading = isPartnerOffer ? "Nowe zgłoszenie oferty partnera Dealshare" : "Nowy brief z formularza Dealshare";
  const sourceUrl = clean(payload.sourceUrl) || "Nie podano";
  const contact = payload.contact ?? {};
  const fullName = clean(contact.fullName);
  const phone = clean(contact.phone);
  const email = clean(contact.email);
  const companyName = clean(contact.companyName) || "Nie podano";
  const nip = clean(contact.nip) || "Nie podano";
  const additionalInfo = clean(payload.additionalInfo) || "Brak dodatkowych informacji.";
  const customContactDateTime = clean(payload.customContactDateTime) || "Nie podano";
  const sentAt = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
  const preferredContactMethod = list(payload.preferredContactMethod);
  const preferredContactTime = list(payload.preferredContactTime);
  const answers = (payload.answers ?? []).filter((answer) => (answer.selectedOptions ?? []).some((option) => clean(option)));

  const text = [
    emailHeading,
    "",
    ...(isPartnerOffer ? ["Cel formularza:", "Zgłoszenie oferty do Dealshare", ""] : []),
    "Oferta:",
    `Nazwa oferty: ${offerTitle}`,
    "",
    "Dane kontaktowe:",
    `Imię i nazwisko: ${fullName}`,
    `Telefon: ${phone}`,
    `E-mail: ${email}`,
    `Nazwa firmy: ${companyName}`,
    `NIP: ${nip}`,
    "",
    "Preferowany kontakt:",
    `Forma kontaktu: ${preferredContactMethod.join(", ")}`,
    `Wybrane godziny kontaktu: ${preferredContactTime.join(", ")}`,
    `Konkretna data i godzina: ${customContactDateTime}`,
    "",
    "Odpowiedzi z briefu:",
    ...answers.flatMap((answer) => [
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
    "Informacje techniczne:",
    `Data wysłania: ${sentAt}`,
    `Adres strony / źródło formularza: ${sourceUrl}`,
    `ID oferty: ${offerId}`
  ].join("\n");

  const answerHtml = answers
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
      <h1 style="margin:0 0 18px;color:#001f4d;">${escapeHtml(emailHeading)}</h1>
      ${isPartnerOffer ? '<h2 style="margin:24px 0 8px;color:#001f4d;">Cel formularza</h2><p style="margin:0;">Zgłoszenie oferty do Dealshare</p>' : ""}
      <h2 style="margin:24px 0 8px;color:#001f4d;">Oferta</h2>
      <p style="margin:0;"><strong>Nazwa oferty:</strong> ${escapeHtml(offerTitle)}</p>

      <h2 style="margin:24px 0 8px;color:#001f4d;">Dane kontaktowe</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #dbe4ef;">
        <tr><td style="border:1px solid #dbe4ef;"><strong>Imię i nazwisko</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(fullName)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>Telefon</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(phone)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>E-mail</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(email)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>Nazwa firmy</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(companyName)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>NIP</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(nip)}</td></tr>
      </table>

      <h2 style="margin:24px 0 8px;color:#001f4d;">Preferowany kontakt</h2>
      <p><strong>Forma kontaktu:</strong> ${escapeHtml(preferredContactMethod.join(", "))}</p>
      <p><strong>Wybrane godziny kontaktu:</strong> ${escapeHtml(preferredContactTime.join(", "))}</p>
      <p><strong>Konkretna data i godzina:</strong> ${escapeHtml(customContactDateTime)}</p>

      <h2 style="margin:24px 0 8px;color:#001f4d;">Odpowiedzi z briefu</h2>
      ${answerHtml}

      <h2 style="margin:24px 0 8px;color:#001f4d;">Dodatkowe informacje</h2>
      <p>${escapeHtml(additionalInfo).replace(/\n/g, "<br />")}</p>

      <h2 style="margin:24px 0 8px;color:#001f4d;">Informacje techniczne</h2>
      <p><strong>Data wysłania:</strong> ${escapeHtml(sentAt)}</p>
      <p><strong>Adres strony / źródło formularza:</strong> ${escapeHtml(sourceUrl)}</p>
      <p><strong>ID oferty:</strong> ${escapeHtml(offerId)}</p>
    </div>
  `;

  return { text, html, fullName, email, offerTitle, isPartnerOffer };
}

function buildClosedOfferEmail(payload: ClosedOfferNotifyPayload) {
  const offerTitle = clean(payload.offerTitle) || "Nie podano";
  const offerId = clean(payload.offerId) || "Nie podano";
  const email = clean(payload.email);
  const sourceUrl = clean(payload.sourceUrl) || "Nie podano";
  const sentAt = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });

  const text = [
    "Powiadomienie o zainteresowaniu zamkniętą ofertą",
    "",
    `Oferta: ${offerTitle}`,
    `ID oferty: ${offerId}`,
    `E-mail zainteresowanego: ${email}`,
    "",
    "Informacje techniczne:",
    `Data wysłania: ${sentAt}`,
    `Adres strony / źródło formularza: ${sourceUrl}`
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#10233f;line-height:1.55;max-width:720px;">
      <h1 style="margin:0 0 18px;color:#001f4d;">Powiadomienie o zainteresowaniu zamkniętą ofertą</h1>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;border:1px solid #dbe4ef;">
        <tr><td style="border:1px solid #dbe4ef;"><strong>Oferta</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(offerTitle)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>ID oferty</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(offerId)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>E-mail</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(email)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>Data wysłania</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(sentAt)}</td></tr>
        <tr><td style="border:1px solid #dbe4ef;"><strong>Źródło</strong></td><td style="border:1px solid #dbe4ef;">${escapeHtml(sourceUrl)}</td></tr>
      </table>
    </div>
  `;

  return { text, html, email, offerTitle };
}

export async function POST(request: Request) {
  let payload: ContactPayload | BriefPayload | ClosedOfferNotifyPayload;

  try {
    payload = (await request.json()) as ContactPayload | BriefPayload;
  } catch {
    return NextResponse.json({ message: "Nieprawidłowe dane formularza." }, { status: 400 });
  }

  const mailer = createMailer();

  if (!mailer) {
    return NextResponse.json({ message: "Formularz będzie dostępny już wkrótce." }, { status: 503 });
  }

  if ("type" in payload && payload.type === "brief") {
    const fullName = clean(payload.contact?.fullName);
    const phone = clean(payload.contact?.phone);
    const email = clean(payload.contact?.email);

    const needsCustomContactDateTime = payload.preferredContactTime?.includes("Konkretna data i godzina");

    if (!fullName || !phone || !isValidEmail(email) || !payload.preferredContactMethod?.length || !payload.preferredContactTime?.length || (needsCustomContactDateTime && !clean(payload.customContactDateTime))) {
      return NextResponse.json({ message: "Uzupełnij dane kontaktowe, poprawny e-mail oraz preferowany kontakt." }, { status: 400 });
    }

    const briefEmail = buildBriefEmail(payload);

    try {
      await mailer.transporter.sendMail({
        from: mailer.smtpFrom,
        to: contactEmail,
        replyTo: briefEmail.email,
        subject: briefEmail.isPartnerOffer ? `[Dealshare] Nowe zgłoszenie oferty partnera — ${briefEmail.fullName}` : `[Dealshare] Nowy brief: ${briefEmail.offerTitle} — ${briefEmail.fullName}`,
        text: briefEmail.text,
        html: briefEmail.html
      });

      return NextResponse.json({ message: "Dziękujemy — brief został wysłany. Skontaktujemy się z Tobą z konkretną strategią działania." });
    } catch {
      return NextResponse.json({ message: "Nie udało się wysłać briefu. Spróbuj ponownie później." }, { status: 500 });
    }
  }

  if ("type" in payload && payload.type === "closed-offer-notify") {
    const email = clean(payload.email);
    const offerTitle = clean(payload.offerTitle);
    const offerId = clean(payload.offerId);

    if (!isValidEmail(email) || !offerTitle || !offerId || payload.consent !== true) {
      return NextResponse.json({ message: "Wpisz poprawny adres e-mail i zaakceptuj regulamin." }, { status: 400 });
    }

    const closedOfferEmail = buildClosedOfferEmail(payload);

    try {
      await mailer.transporter.sendMail({
        from: mailer.smtpFrom,
        to: contactEmail,
        replyTo: closedOfferEmail.email,
        subject: `[Dealshare] Powiadomienie o zamkniętej ofercie: ${closedOfferEmail.offerTitle}`,
        text: closedOfferEmail.text,
        html: closedOfferEmail.html
      });

      return NextResponse.json({ message: "Dziękujemy. Damy znać, kiedy oferta wróci albo pojawi się podobna możliwość." });
    } catch {
      return NextResponse.json({ message: "Nie udało się zapisać adresu e-mail. Spróbuj ponownie później." }, { status: 500 });
    }
  }

  const contactPayload = payload as ContactPayload;
  const needCategory = clean(contactPayload.needCategory);
  const name = clean(contactPayload.name);
  const email = clean(contactPayload.email);
  const phone = clean(contactPayload.phone);
  const company = clean(contactPayload.company);
  const message = clean(contactPayload.message);

  if (!name || !isValidEmail(email) || message.length < 10) {
    return NextResponse.json({ message: "Uzupełnij imię i nazwisko, poprawny e-mail oraz wiadomość (minimum 10 znaków)." }, { status: 400 });
  }

  const text = [
    ...(needCategory ? [`Obszar potrzeby: ${needCategory}`] : []),
    `Imię i nazwisko: ${name}`,
    `E-mail: ${email}`,
    `Telefon: ${phone || "Nie podano"}`,
    `Firma: ${company || "Nie podano"}`,
    "",
    "Wiadomość:",
    message
  ].join("\n");

  const emailSubject = needCategory
    ? `Nowa potrzeba z Dealshare: ${needCategory} - ${name}`
    : `Nowa wiadomość z formularza kontaktowego Dealshare - ${name}`;

  try {
    await mailer.transporter.sendMail({
      from: mailer.smtpFrom,
      to: contactEmail,
      replyTo: email,
      subject: emailSubject,
      text
    });

    return NextResponse.json({ message: "Dziękujemy. Wiadomość została wysłana." });
  } catch {
    return NextResponse.json({ message: "Nie udało się wysłać wiadomości. Spróbuj ponownie później." }, { status: 500 });
  }
}
