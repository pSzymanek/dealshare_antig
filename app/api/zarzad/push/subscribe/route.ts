import { NextResponse } from "next/server";
import { getZarzadSupabaseAdmin, verifyBoardRequest } from "@/lib/zarzad-supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const profile = await verifyBoardRequest(request);

  if (!profile) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Niepełne dane subskrypcji." }, { status: 400 });
    }

    const supabase = getZarzadSupabaseAdmin();
    const { error } = await supabase.from("board_push_subscriptions").upsert(
      {
        user_id: profile.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_agent: userAgent || null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "endpoint" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Powiadomienia zostały pomyślnie włączone na tym urządzeniu." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Błąd zapisu subskrypcji." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const profile = await verifyBoardRequest(request);

  if (!profile) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: "Brak endpointu." }, { status: 400 });
    }

    const supabase = getZarzadSupabaseAdmin();
    await supabase.from("board_push_subscriptions").delete().eq("endpoint", endpoint).eq("user_id", profile.id);

    return NextResponse.json({ ok: true, message: "Powiadomienia zostały wyłączone." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
