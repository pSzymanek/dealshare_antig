import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getZarzadSupabaseAdmin, verifyBoardRequest } from "@/lib/zarzad-supabase-admin";

type MailPayload = {
  templateId?: string;
  recipients?: string[];
};

const yamuraTemplateId = "yamurapro-phone-followup";
const yamuraHtmlPath = path.join(process.cwd(), "content", "mail-templates", "yamurapro-phone-followup.html");
const yamuraAttachmentPath = path.join(process.cwd(), "private", "mail-attachments", "yamurapro-broszura.pdf");

const templates = {
  [yamuraTemplateId]: {
    label: "YamuraPRO - po rozmowie telefonicznej",
    from: process.env.SMTP_FROM ?? "Dealshare <biuro@dealshare.pl>",
    subject: "W nawiązaniu do rozmowy telefonicznej | YamuraPRO",
    attachmentName: "yamurapro-broszura.pdf"
  }
};

function clean(value?: string) {
  return value?.trim() ?? "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createMailer() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
}

export async function POST(request: Request) {
  const profile = await verifyBoardRequest(request);

  if (!profile) {
    return NextResponse.json({ message: "Brak dostępu." }, { status: 401 });
  }

  let payload: MailPayload;

  try {
    payload = (await request.json()) as MailPayload;
  } catch {
    return NextResponse.json({ message: "Nieprawidłowe dane wysyłki." }, { status: 400 });
  }

  const template = templates[payload.templateId as keyof typeof templates];

  if (!template) {
    return NextResponse.json({ message: "Nie wybrano poprawnego wzoru maila." }, { status: 400 });
  }

  const uniqueRecipients = Array.from(new Set((payload.recipients ?? []).map(clean).filter(Boolean)));
  const invalidRecipients = uniqueRecipients.filter((recipient) => !isValidEmail(recipient));

  if (!uniqueRecipients.length) {
    return NextResponse.json({ message: "Dodaj minimum jeden adres e-mail." }, { status: 400 });
  }

  if (uniqueRecipients.length > 50) {
    return NextResponse.json({ message: "Na raz można wysłać maksymalnie 50 osobnych maili." }, { status: 400 });
  }

  if (invalidRecipients.length) {
    return NextResponse.json({ message: `Niepoprawne adresy: ${invalidRecipients.join(", ")}` }, { status: 400 });
  }

  const transporter = createMailer();

  if (!transporter) {
    return NextResponse.json({ message: "Brakuje konfiguracji SMTP. Uzupełnij SMTP_HOST, SMTP_PORT, SMTP_USER i SMTP_PASS." }, { status: 503 });
  }

  const html = await readFile(yamuraHtmlPath, "utf8");
  const attachment = await readFile(yamuraAttachmentPath);
  const sent: string[] = [];

  try {
    for (const recipient of uniqueRecipients) {
      await transporter.sendMail({
        from: template.from,
        to: recipient,
        subject: template.subject,
        html,
        attachments: [
          {
            filename: template.attachmentName,
            content: attachment,
            contentType: "application/pdf"
          }
        ]
      });

      sent.push(recipient);
    }

    const supabase = getZarzadSupabaseAdmin();
    await supabase.from("board_activity_log").insert({
      actor_id: profile.id,
      action: "mail_sent",
      entity_type: "mail_template",
      metadata: {
        templateId: payload.templateId,
        recipients: sent
      }
    });

    return NextResponse.json({
      message: `Wysłano ${sent.length} osobnych maili.`,
      sent
    });
  } catch {
    return NextResponse.json(
      {
        message: sent.length ? `Przerwano wysyłkę po ${sent.length} mailach. Sprawdź konfigurację SMTP i spróbuj ponownie.` : "Nie udało się wysłać maila. Sprawdź konfigurację SMTP.",
        sent
      },
      { status: 500 }
    );
  }
}
