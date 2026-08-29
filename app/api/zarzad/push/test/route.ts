import { NextResponse } from "next/server";
import { verifyBoardRequest } from "@/lib/zarzad-supabase-admin";
import { sendPushToUsers } from "@/lib/zarzad-push";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const profile = await verifyBoardRequest(request);

  if (!profile) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  try {
    const result = await sendPushToUsers({
      userIds: [profile.id],
      payload: {
        title: "DEALSHARE Board",
        body: `Cześć ${profile.full_name}! Powiadomienia na Twoim telefonie działają prawidłowo.`,
        url: "/zarzad",
        tag: "test-notification"
      }
    });

    if (result.sent === 0) {
      return NextResponse.json({
        ok: false,
        message: "Nie znaleziono aktywnej subskrypcji na tym telefonie. Upewnij się, że kliknięto 'Włącz powiadomienia'."
      });
    }

    return NextResponse.json({
      ok: true,
      message: `Powiadomienie testowe wysłane na Twoje urządzenia (${result.sent}).`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Błąd wysyłki testowego powiadomienia." }, { status: 500 });
  }
}
