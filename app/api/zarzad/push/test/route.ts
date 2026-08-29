import { NextResponse } from "next/server";
import { getZarzadSupabaseAdmin, verifyBoardRequest } from "@/lib/zarzad-supabase-admin";
import { sendPushToUsers } from "@/lib/zarzad-push";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const profile = await verifyBoardRequest(request);

  if (!profile) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  try {
    let bodyData: any = {};
    try {
      bodyData = await request.json();
    } catch {}

    const supabase = getZarzadSupabaseAdmin();

    // If client provided subscription directly, upsert it immediately
    if (bodyData?.subscription?.endpoint && bodyData?.subscription?.keys) {
      await supabase.from("board_push_subscriptions").upsert(
        {
          user_id: profile.id,
          endpoint: bodyData.subscription.endpoint,
          p256dh: bodyData.subscription.keys.p256dh,
          auth: bodyData.subscription.keys.auth,
          user_agent: bodyData.userAgent || null,
          updated_at: new Date().toISOString()
        },
        { onConflict: "endpoint" }
      );
    }

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
        message: "Nie znaleziono aktywnej subskrypcji na tym telefonie. Spróbuj kliknąć 'Włącz powiadomienia'."
      });
    }

    return NextResponse.json({
      ok: true,
      message: `Powiadomienie testowe wysłane! Zablokuj telefon.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Błąd wysyłki testowego powiadomienia." }, { status: 500 });
  }
}
