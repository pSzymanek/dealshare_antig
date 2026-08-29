import { NextResponse } from "next/server";
import { verifyBoardRequest } from "@/lib/zarzad-supabase-admin";
import { sendPushToUsers } from "@/lib/zarzad-push";

export const dynamic = "force-dynamic";

type BroadcastBody = {
  type: "chat" | "task_assigned" | "announcement" | "event_invite";
  title?: string;
  body?: string;
  targetUserId?: string;
  url?: string;
};

export async function POST(request: Request) {
  const profile = await verifyBoardRequest(request);

  if (!profile) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  try {
    const data = (await request.json()) as BroadcastBody;

    if (data.type === "chat") {
      await sendPushToUsers({
        excludeUserId: profile.id,
        payload: {
          title: `Nowa wiadomość: ${profile.full_name}`,
          body: data.body || "Nowa wiadomość na czacie Zarządu",
          url: "/zarzad",
          tag: "board-chat"
        }
      });
    } else if (data.type === "task_assigned" && data.targetUserId && data.targetUserId !== profile.id) {
      await sendPushToUsers({
        userIds: [data.targetUserId],
        payload: {
          title: `Nowe zadanie od ${profile.full_name}`,
          body: data.title ? `Przypisano: ${data.title}` : "Przypisano Ci nowe zadanie w panelu Zarządu",
          url: "/zarzad",
          tag: "board-task"
        }
      });
    } else if (data.type === "announcement") {
      await sendPushToUsers({
        excludeUserId: profile.id,
        payload: {
          title: `Ważny komunikat Zarządu: ${data.title || ""}`,
          body: data.body || "Dodano nowy komunikat w panelu Zarządu",
          url: "/zarzad",
          tag: "board-announcement"
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Błąd wysyłki powiadomienia." }, { status: 500 });
  }
}
