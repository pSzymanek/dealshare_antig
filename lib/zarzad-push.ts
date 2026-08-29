import webpush from "web-push";
import { getZarzadSupabaseAdmin } from "./zarzad-supabase-admin";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BNPN4-9xeYkd-GUx0ScFQwmSscEE-0ifqaTjHxwqqy5LQkvLwwwkGIvq159W6NOTyXvdN0N0q3mvHP6BJp0q2iA";
const privateKey = process.env.VAPID_PRIVATE_KEY || "MUzvCUcp8g0FyLwfpQkHwtYyEcKblLuCSGTKZj_fKMg";
const subject = process.env.VAPID_SUBJECT || "mailto:biuro@dealshare.pl";

if (publicKey && privateKey) {
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
  } catch (error) {
    console.error("Błąd konfiguracji VAPID:", error);
  }
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export async function sendPushToUsers({
  userIds,
  excludeUserId,
  payload
}: {
  userIds?: string[];
  excludeUserId?: string;
  payload: PushPayload;
}) {
  const supabase = getZarzadSupabaseAdmin();
  let query = supabase.from("board_push_subscriptions").select("id,user_id,endpoint,p256dh,auth");

  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }

  if (excludeUserId) {
    query = query.neq("user_id", excludeUserId);
  }

  const { data: subscriptions, error } = await query;

  if (error || !subscriptions || subscriptions.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const payloadString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || "/zarzad",
    tag: payload.tag || "dealshare-board-notification"
  });

  const staleSubscriptionIds: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          },
          payloadString
        );
        sent++;
      } catch (err: any) {
        failed++;
        if (err.statusCode === 410 || err.statusCode === 404) {
          staleSubscriptionIds.push(sub.id);
        }
      }
    })
  );

  if (staleSubscriptionIds.length > 0) {
    await supabase.from("board_push_subscriptions").delete().in("id", staleSubscriptionIds);
  }

  return { sent, failed };
}
