"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ZarzadLogin } from "@/components/zarzad/ZarzadLogin";
import { ZarzadPushManager } from "@/components/zarzad/ZarzadPushManager";
import { createZarzadSupabaseClient } from "@/lib/zarzad-supabase";

type TabId = "dashboard" | "calendar" | "tasks" | "notes" | "announcements" | "mail" | "chat";
type TaskStatus = "todo" | "doing" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";
type AnnouncementPriority = "normal" | "important" | "critical";
type CalendarMode = "month" | "week" | "day";

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: "admin";
  is_active: boolean;
};

type BoardTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type BoardEvent = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  event_type: string;
  participant_ids: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type BoardNote = {
  id: string;
  title: string;
  body: string;
  category: string;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type BoardAnnouncement = {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type ChatMessage = {
  id: string;
  body: string;
  created_by: string | null;
  created_at: string;
};

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "calendar", label: "Kalendarz", icon: "◷" },
  { id: "tasks", label: "Zadania", icon: "✓" },
  { id: "notes", label: "Notatki", icon: "✎" },
  { id: "announcements", label: "Komunikaty", icon: "!" },
  { id: "mail", label: "Mail", icon: "@" },
  { id: "chat", label: "Chat", icon: "●" }
];

const compactTabLabels: Record<TabId, string> = {
  dashboard: "Panel",
  calendar: "Kal.",
  tasks: "Zad.",
  notes: "Not.",
  announcements: "Kom.",
  mail: "Mail",
  chat: "Chat"
};

const mailTemplates = [
  {
    id: "yamurapro-phone-followup",
    name: "YamuraPRO - po rozmowie telefonicznej",
    from: "biuro@dealshare.pl",
    subject: "W nawiązaniu do rozmowy telefonicznej | YamuraPRO",
    attachment: "yamurapro-broszura.pdf"
  }
];

const calendarModeLabels: Record<CalendarMode, string> = {
  month: "Miesiąc",
  week: "Tydzień",
  day: "Dzień"
};

const weekDayLabels = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

const statusLabels: Record<TaskStatus, string> = {
  todo: "Do zrobienia",
  doing: "W toku",
  done: "Zrobione"
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki",
  urgent: "Pilne"
};

const announcementPriorityLabels: Record<AnnouncementPriority, string> = {
  normal: "Normalny",
  important: "Ważny",
  critical: "Krytyczny"
};

function formatDateTime(value?: string | null): string {
  if (!value) return "Brak terminu";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nieprawidłowa data";
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatTime(value?: string | null): string {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function toDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIso(value: string): string | null {
  if (!value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isSameDay(first: Date, second: Date): boolean {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isSameMonth(first: Date, second: Date): boolean {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getMonthGrid(focusedDate: Date): Date[] {
  const year = focusedDate.getFullYear();
  const month = focusedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = startOfWeek(firstDay);
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

function eventsForDay(events: BoardEvent[], day: Date): BoardEvent[] {
  return events.filter((event) => isSameDay(new Date(event.starts_at), day));
}

function calendarRangeTitle(mode: CalendarMode, focusedDate: Date): string {
  if (mode === "day") {
    return new Intl.DateTimeFormat("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(focusedDate);
  }

  if (mode === "week") {
    const start = startOfWeek(focusedDate);
    const end = addDays(start, 6);
    const startText = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" }).format(start);
    const endText = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", year: "numeric" }).format(end);
    return `${startText} - ${endText}`;
  }

  return new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(focusedDate);
}

function priorityClass(priority: TaskPriority): string {
  switch (priority) {
    case "urgent":
      return "border-red-300 bg-red-50 text-red-700";
    case "high":
      return "border-amber-300 bg-amber-50 text-amber-800";
    case "medium":
      return "border-cyan/30 bg-cyan/10 text-navy";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function announcementPriorityClass(priority: AnnouncementPriority): string {
  switch (priority) {
    case "critical":
      return "border-red-300 bg-red-100 text-red-800 font-black";
    case "important":
      return "border-amber-300 bg-amber-100 text-amber-900 font-bold";
    default:
      return "border-cyan/30 bg-cyan/10 text-navy font-bold";
  }
}

function statusClass(status: TaskStatus): string {
  switch (status) {
    case "done":
      return "border-teal/30 bg-teal/10 text-teal font-bold";
    case "doing":
      return "border-electric/30 bg-electric/10 text-electric font-bold";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function parseRecipients(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter((item) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item))
    )
  );
}

export function ZarzadApp() {
  const supabase = useMemo(() => createZarzadSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [targetItemId, setTargetItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [events, setEvents] = useState<BoardEvent[]>([]);
  const [notes, setNotes] = useState<BoardNote[]>([]);
  const [announcements, setAnnouncements] = useState<BoardAnnouncement[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const profileMap = useMemo(() => {
    return new Map(profiles.map((item) => [item.id, item.full_name]));
  }, [profiles]);

  const profileName = useCallback(
    (id?: string | null) => {
      if (!id) return "Nieprzypisane";
      return profileMap.get(id) ?? "Użytkownik";
    },
    [profileMap]
  );

  const navigateTo = useCallback((tab: TabId, itemId?: string) => {
    setActiveTab(tab);
    setTargetItemId(itemId ?? null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setNotice(null);

    const [
      { data: profileRows, error: profileError },
      { data: taskRows, error: taskError },
      { data: eventRows, error: eventError },
      { data: noteRows, error: noteError },
      { data: announcementRows, error: announcementError },
      { data: messageRows, error: messageError }
    ] = await Promise.all([
      supabase.from("board_profiles").select("id,email,full_name,role,is_active").order("full_name"),
      supabase.from("board_tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("board_calendar_events").select("*").order("starts_at", { ascending: true }),
      supabase.from("board_notes").select("*").order("created_at", { ascending: false }),
      supabase.from("board_announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("board_chat_messages").select("*").order("created_at", { ascending: true }).limit(80)
    ]);

    const error =
      profileError ?? taskError ?? eventError ?? noteError ?? announcementError ?? messageError;

    if (error) {
      setNotice(error.message);
    } else {
      setProfiles((profileRows as Profile[]) ?? []);
      setTasks((taskRows as BoardTask[]) ?? []);
      setEvents((eventRows as BoardEvent[]) ?? []);
      setNotes((noteRows as BoardNote[]) ?? []);
      setAnnouncements((announcementRows as BoardAnnouncement[]) ?? []);
      setMessages((messageRows as ChatMessage[]) ?? []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setSessionLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!session) return;
    loadBoard();
  }, [session, loadBoard]);

  const broadcastPush = useCallback(
    async (type: string, data: { title?: string; body?: string; targetUserId?: string; url?: string }) => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) return;
        fetch("/api/zarzad/push/broadcast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ type, ...data })
        }).catch((e) => console.error("Push broadcast error:", e));
      } catch (err) {
        console.error("Push broadcast error:", err);
      }
    },
    [supabase]
  );

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (sessionLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7fbff] p-5 text-slate-800">
        <div className="card-glass rounded-lg border border-slate-200 bg-white p-8 text-center shadow-card">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">dealshare board</p>
          <p className="mt-3 text-lg font-bold text-navy">Ładowanie panelu zarządu...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return <ZarzadLogin onSignedIn={() => loadBoard()} />;
  }

  const currentUserId = session.user.id;
  const now = new Date().getTime();

  const overdueTasks = tasks.filter((task) => {
    if (task.status === "done" || !task.due_at) return false;
    return new Date(task.due_at).getTime() < now;
  });

  const openTasks = tasks.filter((task) => task.status !== "done");
  const upcomingEvents = events.filter((event) => new Date(event.starts_at).getTime() >= now - 1000 * 60 * 60);
  const pinnedNotes = notes.filter((note) => note.is_pinned).slice(0, 4);
  const pinnedAnnouncements = announcements.filter((announcement) => announcement.is_pinned).slice(0, 4);

  const commonProps = {
    supabase,
    currentUserId,
    profiles,
    profileName,
    reload: loadBoard,
    onError: setNotice,
    targetItemId,
    clearTarget: () => setTargetItemId(null),
    broadcastPush
  };

  const activeView =
    activeTab === "calendar" ? (
      <CalendarView {...commonProps} events={events} />
    ) : activeTab === "tasks" ? (
      <TasksView {...commonProps} tasks={tasks} />
    ) : activeTab === "notes" ? (
      <NotesView {...commonProps} notes={notes} />
    ) : activeTab === "announcements" ? (
      <AnnouncementsView {...commonProps} announcements={announcements} />
    ) : activeTab === "mail" ? (
      <MailView supabase={supabase} />
    ) : activeTab === "chat" ? (
      <ChatView {...commonProps} messages={messages} />
    ) : (
      <DashboardView
        tasks={tasks}
        upcomingEvents={upcomingEvents}
        overdueTasks={overdueTasks}
        openTasks={openTasks}
        pinnedNotes={pinnedNotes}
        pinnedAnnouncements={pinnedAnnouncements}
        messages={messages}
        profileName={profileName}
        onNavigate={navigateTo}
      />
    );

  return (
    <main className="min-h-screen bg-[#f7fbff] pb-24 text-slate-900 sm:pb-0">
      <section className="bg-navy-gradient text-white">
        <div className="mx-auto flex min-h-[184px] w-full max-w-7xl flex-col justify-between gap-7 px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image src="/sygnet-white.png" alt="" width={56} height={56} className="h-12 w-12 rounded-md object-contain" priority />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan">dealshare board</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Centrum zarządzania</h1>
                <p className="mt-1 text-sm font-semibold text-white/68">{session.user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ZarzadPushManager supabase={supabase} />
              <InstallPwa />
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/14 bg-white px-3.5 text-xs font-black text-navy transition hover:bg-white/90"
              >
                Wyloguj
              </button>
            </div>
          </div>

          <nav className="board-nav-desktop grid-cols-7 gap-2 rounded-lg border border-white/10 bg-white/8 p-2 backdrop-blur">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={(id) => navigateTo(id)} />
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
        {notice ? <p className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{notice}</p> : null}
        {loading ? <p className="mb-5 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">Odświeżam dane...</p> : null}
        {activeView}
      </section>

      <nav className="board-nav-mobile fixed inset-x-0 bottom-0 z-40 grid-cols-7 border-t border-slate-200 bg-white/96 px-1 py-2 shadow-[0_-10px_30px_rgba(15,23,42,.10)] backdrop-blur">
        {tabs.map((tab) => (
          <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={(id) => navigateTo(id)} compact />
        ))}
      </nav>
    </main>
  );
}

function TabButton({
  tab,
  activeTab,
  setActiveTab,
  compact = false
}: {
  tab: { id: TabId; label: string; icon: string };
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  compact?: boolean;
}) {
  function selectTab() {
    setActiveTab(tab.id);
  }

  return (
    <button
      type="button"
      onClick={selectTab}
      onPointerUp={compact ? selectTab : undefined}
      aria-label={tab.label}
      className={`${compact ? "min-h-14 px-1 text-[10px]" : "min-h-14 px-2 text-xs sm:text-sm"} rounded-md py-2 text-center font-black transition ${
        activeTab === tab.id ? (compact ? "bg-navy text-white" : "bg-white text-navy shadow-sm") : compact ? "text-slate-500" : "text-white/76 hover:bg-white/10 hover:text-white"
      }`}
      aria-pressed={activeTab === tab.id}
    >
      <span className="block text-lg leading-none">{tab.icon}</span>
      <span className="mt-1 block truncate">{compact ? compactTabLabels[tab.id] : tab.label}</span>
    </button>
  );
}

function DashboardView({
  tasks,
  upcomingEvents,
  overdueTasks,
  openTasks,
  pinnedNotes,
  pinnedAnnouncements,
  messages,
  profileName,
  onNavigate
}: {
  tasks: BoardTask[];
  upcomingEvents: BoardEvent[];
  overdueTasks: BoardTask[];
  openTasks: BoardTask[];
  pinnedNotes: BoardNote[];
  pinnedAnnouncements: BoardAnnouncement[];
  messages: ChatMessage[];
  profileName: (id?: string | null) => string;
  onNavigate: (tab: TabId, targetId?: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="flex flex-col gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SectionTitle eyebrow="Aktualny obraz" title="Najważniejsze sprawy zarządu" />
            <span className="w-fit rounded-md border border-teal/20 bg-teal/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal">
              Supabase live
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="group rounded-lg border border-slate-200 bg-mist p-4 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">Otwarte zadania</p>
                <span className="text-xs font-bold text-cyan opacity-0 transition group-hover:opacity-100">&rarr;</span>
              </div>
              <p className="mt-3 text-3xl font-black text-navy">{openTasks.length}</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className={`group rounded-lg border p-4 text-left transition duration-200 ${
                overdueTasks.length ? "border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100" : "border-slate-200 bg-mist hover:border-cyan/60 hover:bg-cyan/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${overdueTasks.length ? "text-red-700" : "text-slate-600"}`}>Po terminie</p>
                <span className="text-xs font-bold text-red-600 opacity-0 transition group-hover:opacity-100">&rarr;</span>
              </div>
              <p className={`mt-3 text-3xl font-black ${overdueTasks.length ? "text-red-700" : "text-navy"}`}>{overdueTasks.length}</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("calendar")}
              className="group rounded-lg border border-slate-200 bg-mist p-4 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">Wydarzenia</p>
                <span className="text-xs font-bold text-cyan opacity-0 transition group-hover:opacity-100">&rarr;</span>
              </div>
              <p className="mt-3 text-3xl font-black text-navy">{upcomingEvents.length}</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("chat")}
              className="group rounded-lg border border-slate-200 bg-mist p-4 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">Wiadomości</p>
                <span className="text-xs font-bold text-cyan opacity-0 transition group-hover:opacity-100">&rarr;</span>
              </div>
              <p className="mt-3 text-3xl font-black text-navy">{messages.length}</p>
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            {overdueTasks.length ? (
              <div className="grid gap-2">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-red-700">Zadania wymagające pilnej reakcji</p>
                {overdueTasks.slice(0, 4).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => onNavigate("tasks", task.id)}
                    className="group flex flex-col items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-left transition duration-200 hover:border-red-400 hover:bg-red-100/80 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="font-black text-navy group-hover:text-red-800">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {profileName(task.assigned_to)} · <span className="font-bold text-red-700">{formatDateTime(task.due_at)}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-bold text-red-700 shadow-sm">
                      Otwórz zadanie &rarr;
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-navy p-5 text-white">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan">Stan dnia</p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">Brak zadań po terminie</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">Wszystkie sprawy bieżące są pod kontrolą. Kliknij dowolny kafelek, aby przejść bezpośrednio do wybranego modułu.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Recent Tasks Block on Left Column */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-navy">Ostatnie zadania</h3>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="text-xs font-bold text-electric transition hover:text-teal"
            >
              Wszystkie zadania &rarr;
            </button>
          </div>
          <div className="mt-4 grid gap-2.5">
            {tasks.slice(0, 4).map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onNavigate("tasks", task.id)}
                className="group flex items-center justify-between rounded-md border border-slate-200 bg-mist px-3.5 py-2.5 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${statusClass(task.status)}`}>
                    {statusLabels[task.status]}
                  </span>
                  <span className="truncate text-sm font-bold text-navy group-hover:text-electric">{task.title}</span>
                </div>
                <span className="shrink-0 text-xs text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan">&rarr;</span>
              </button>
            ))}
            {!tasks.length ? <p className="text-sm text-slate-500">Brak zadań.</p> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        {/* Najbliższe wydarzenia */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-navy">Najbliższe wydarzenia</h3>
            <button
              type="button"
              onClick={() => onNavigate("calendar")}
              className="text-xs font-bold text-electric transition hover:text-teal"
            >
              Kalendarz &rarr;
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {upcomingEvents.length ? (
              upcomingEvents.slice(0, 4).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => onNavigate("calendar", event.id)}
                  className="group flex items-center justify-between rounded-md border border-slate-200 bg-mist px-3.5 py-2.5 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/[0.04]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-electric">{formatDateTime(event.starts_at)}</p>
                    <p className="mt-0.5 truncate text-sm font-black text-navy group-hover:text-electric">{event.title}</p>
                    {event.location ? <p className="text-xs text-slate-500">{event.location}</p> : null}
                  </div>
                  <span className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan">&rarr;</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Brak zaplanowanych wydarzeń.</p>
            )}
          </div>
        </div>

        {/* Przypięte komunikaty */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-navy">Przypięte komunikaty</h3>
            <button
              type="button"
              onClick={() => onNavigate("announcements")}
              className="text-xs font-bold text-electric transition hover:text-teal"
            >
              Wszystkie &rarr;
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {pinnedAnnouncements.length ? (
              pinnedAnnouncements.map((announcement) => (
                <button
                  key={announcement.id}
                  type="button"
                  onClick={() => onNavigate("announcements", announcement.id)}
                  className="group flex items-center justify-between rounded-md border border-slate-200 bg-mist px-3.5 py-2.5 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/[0.04]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${announcementPriorityClass(announcement.priority)}`}>
                        {announcementPriorityLabels[announcement.priority]}
                      </span>
                      <p className="truncate text-sm font-black text-navy group-hover:text-electric">{announcement.title}</p>
                    </div>
                    {announcement.body ? (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-600">{announcement.body}</p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan">&rarr;</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Brak przypiętych komunikatów.</p>
            )}
          </div>
        </div>

        {/* Przypięte notatki */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-navy">Przypięte notatki</h3>
            <button
              type="button"
              onClick={() => onNavigate("notes")}
              className="text-xs font-bold text-electric transition hover:text-teal"
            >
              Wszystkie &rarr;
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {pinnedNotes.length ? (
              pinnedNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => onNavigate("notes", note.id)}
                  className="group flex items-center justify-between rounded-md border border-slate-200 bg-mist px-3.5 py-2.5 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/[0.04]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {note.category ? (
                        <span className="rounded bg-teal/10 px-1.5 py-0.5 text-[10px] font-bold text-teal">
                          {note.category}
                        </span>
                      ) : null}
                      <p className="truncate text-sm font-black text-navy group-hover:text-electric">{note.title}</p>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-600">{note.body}</p>
                  </div>
                  <span className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan">&rarr;</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Brak przypiętych notatek.</p>
            )}
          </div>
        </div>

        {/* Ostatni chat */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-navy">Ostatni chat</h3>
            <button
              type="button"
              onClick={() => onNavigate("chat")}
              className="text-xs font-bold text-electric transition hover:text-teal"
            >
              Otwórz chat &rarr;
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {messages.length ? (
              messages.slice(-3).map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => onNavigate("chat")}
                  className="group flex items-center justify-between rounded-md border border-slate-200 bg-mist px-3.5 py-2.5 text-left transition duration-200 hover:border-cyan/60 hover:bg-cyan/[0.04]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-navy">{profileName(message.created_by)}:</span>
                      <span className="truncate text-sm font-semibold text-slate-700 group-hover:text-navy">{message.body}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">{formatDateTime(message.created_at)}</p>
                  </div>
                  <span className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan">&rarr;</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Brak wiadomości.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TasksView({
  supabase,
  currentUserId,
  profiles,
  profileName,
  reload,
  onError,
  tasks,
  targetItemId,
  broadcastPush
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profiles: Profile[];
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  tasks: BoardTask[];
  targetItemId?: string | null;
  broadcastPush?: (type: string, data: { title?: string; body?: string; targetUserId?: string; url?: string }) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ title: "", description: "", priority: "medium" as TaskPriority, due_at: "", assigned_to: "" });
  const [filterStatus, setFilterStatus] = useState<"all" | TaskStatus>("all");

  const filteredTasks = useMemo(() => {
    if (filterStatus === "all") return tasks;
    return tasks.filter((t) => t.status === filterStatus);
  }, [tasks, filterStatus]);

  useEffect(() => {
    if (!targetItemId) return;
    const el = document.getElementById(`task-${targetItemId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [targetItemId]);

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.from("board_tasks").insert({
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      due_at: toIso(draft.due_at),
      assigned_to: draft.assigned_to || null,
      created_by: currentUserId
    });
    if (error) {
      onError(error.message);
      return;
    }
    if (draft.assigned_to) {
      broadcastPush?.("task_assigned", { title: draft.title, targetUserId: draft.assigned_to });
    }
    setDraft({ title: "", description: "", priority: "medium", due_at: "", assigned_to: "" });
    await reload();
  }

  async function updateTask(id: string, patch: Partial<BoardTask>) {
    const { error } = await supabase.from("board_tasks").update(patch).eq("id", id);
    if (error) {
      onError(error.message);
      return;
    }
    await reload();
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("board_tasks").delete().eq("id", id);
    if (error) {
      onError(error.message);
      return;
    }
    await reload();
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={createTask} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Zadania" title="Dodaj nowe zadanie" />
        <Field label="Tytuł zadania">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" placeholder="Co jest do zrobienia?" required />
        </Field>
        <Field label="Opis">
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input min-h-28" placeholder="Szczegóły zadania..." />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Priorytet">
            <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as TaskPriority })} className="input">
              <option value="low">Niski</option>
              <option value="medium">Średni</option>
              <option value="high">Wysoki</option>
              <option value="urgent">Pilne</option>
            </select>
          </Field>
          <Field label="Termin">
            <input type="datetime-local" value={draft.due_at} onChange={(e) => setDraft({ ...draft, due_at: e.target.value })} className="input" />
          </Field>
        </div>
        <Field label="Osoba odpowiedzialna">
          <select value={draft.assigned_to} onChange={(e) => setDraft({ ...draft, assigned_to: e.target.value })} className="input">
            <option value="">Nieprzypisane</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name} ({profile.email})
              </option>
            ))}
          </select>
        </Field>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Dodaj zadanie</button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle eyebrow="Zadania" title="Lista operacyjna" />
          <div className="flex flex-wrap gap-1.5 rounded-md border border-slate-200 bg-mist p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`rounded px-2.5 py-1 transition ${filterStatus === "all" ? "bg-navy text-white" : "text-slate-600 hover:text-navy"}`}
            >
              Wszystkie ({tasks.length})
            </button>
            {(["todo", "doing", "done"] as TaskStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`rounded px-2 py-1 transition ${filterStatus === st ? "bg-navy text-white" : "text-slate-600 hover:text-navy"}`}
              >
                {statusLabels[st]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {filteredTasks.map((task) => {
            const isTarget = targetItemId === task.id;
            return (
              <article
                key={task.id}
                id={`task-${task.id}`}
                className={`rounded-lg border p-4 transition duration-300 ${
                  isTarget ? "ring-2 ring-cyan border-cyan bg-cyan/[0.05]" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-black text-navy">{task.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{task.description || "Bez opisu"}</p>
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      {profileName(task.assigned_to)} · {formatDateTime(task.due_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-md border px-3 py-1.5 text-xs font-bold ${statusClass(task.status)}`}>
                      {statusLabels[task.status]}
                    </span>
                    <span className={`rounded-md border px-3 py-1.5 text-xs font-bold ${priorityClass(task.priority)}`}>
                      {priorityLabels[task.priority]}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(["todo", "doing", "done"] as TaskStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateTask(task.id, { status })}
                        className={`rounded-md border px-2.5 py-1.5 text-xs font-bold transition ${
                          task.status === status ? "border-navy bg-navy text-white" : "border-slate-200 bg-white text-navy hover:bg-mist"
                        }`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50"
                  >
                    Usuń
                  </button>
                </div>
              </article>
            );
          })}
          {!filteredTasks.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak zadań w tej kategorii.</p> : null}
        </div>
      </div>
    </section>
  );
}

function CalendarView({
  supabase,
  currentUserId,
  profiles,
  profileName,
  reload,
  onError,
  events,
  targetItemId
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profiles: Profile[];
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  events: BoardEvent[];
  targetItemId?: string | null;
}) {
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    starts_at: toDateTimeLocal(new Date()),
    ends_at: "",
    location: "",
    event_type: "operacyjne",
    participant_ids: [] as string[]
  });
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const [focusedDate, setFocusedDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const sortedEvents = useMemo(
    () => [...events].sort((first, second) => new Date(first.starts_at).getTime() - new Date(second.starts_at).getTime()),
    [events]
  );
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(focusedDate), index)), [focusedDate]);
  const monthDays = useMemo(() => getMonthGrid(focusedDate), [focusedDate]);
  const dayEvents = useMemo(() => eventsForDay(sortedEvents, focusedDate), [focusedDate, sortedEvents]);
  const selectedEvent = useMemo(() => sortedEvents.find((event) => event.id === selectedEventId) ?? null, [selectedEventId, sortedEvents]);

  // Deep linking to an event from dashboard
  useEffect(() => {
    if (!targetItemId) return;
    const ev = events.find((e) => e.id === targetItemId);
    if (ev) {
      setFocusedDate(new Date(ev.starts_at));
      setSelectedEventId(ev.id);
    }
  }, [targetItemId, events]);

  useEffect(() => {
    if (!selectedEventId) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedEventId(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedEventId]);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.from("board_calendar_events").insert({
      ...draft,
      starts_at: new Date(draft.starts_at).toISOString(),
      ends_at: toIso(draft.ends_at),
      created_by: currentUserId
    });
    if (error) {
      onError(error.message);
      return;
    }
    setDraft({ title: "", description: "", starts_at: toDateTimeLocal(new Date()), ends_at: "", location: "", event_type: "operacyjne", participant_ids: [] });
    await reload();
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("board_calendar_events").delete().eq("id", id);
    if (error) {
      onError(error.message);
      return;
    }
    if (selectedEventId === id) {
      setSelectedEventId(null);
    }
    await reload();
  }

  function toggleParticipant(id: string) {
    setDraft((current) => ({
      ...current,
      participant_ids: current.participant_ids.includes(id)
        ? current.participant_ids.filter((item) => item !== id)
        : [...current.participant_ids, id]
    }));
  }

  function moveCalendar(direction: -1 | 1) {
    setFocusedDate((date) => {
      if (calendarMode === "month") {
        return addMonths(date, direction);
      }
      if (calendarMode === "week") {
        return addDays(date, direction * 7);
      }
      return addDays(date, direction);
    });
  }

  function renderEventPill(event: BoardEvent, compact = false) {
    return (
      <button
        key={event.id}
        type="button"
        onClick={() => setSelectedEventId(event.id)}
        className="min-w-0 rounded-md border border-electric/20 bg-electric/8 px-2 py-1 text-left transition hover:border-electric hover:bg-electric/15"
      >
        <p className={`${compact ? "text-[10px]" : "text-xs"} font-black leading-tight text-electric`}>{formatTime(event.starts_at)}</p>
        <p className={`${compact ? "line-clamp-1 text-[11px]" : "text-sm"} font-bold leading-snug text-navy`}>{event.title}</p>
      </button>
    );
  }

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[0.7fr_1.3fr]">
      <form onSubmit={createEvent} className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Kalendarz" title="Dodaj wydarzenie" />
        <Field label="Tytuł">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" placeholder="Nazwa spotkania / terminu" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start">
            <input type="datetime-local" value={draft.starts_at} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} className="input" required />
          </Field>
          <Field label="Koniec">
            <input type="datetime-local" value={draft.ends_at} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })} className="input" />
          </Field>
        </div>
        <Field label="Lokalizacja / Link">
          <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className="input" placeholder="np. Google Meet / Biuro" />
        </Field>
        <Field label="Opis">
          <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input min-h-24" placeholder="Agenda spotkania..." />
        </Field>
        <div className="mt-4">
          <p className="text-sm font-black text-navy">Uczestnicy</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {profiles.map((profile) => (
              <label key={profile.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-mist">
                <input type="checkbox" checked={draft.participant_ids.includes(profile.id)} onChange={() => toggleParticipant(profile.id)} />
                {profile.full_name}
              </label>
            ))}
          </div>
        </div>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-4 py-3 text-sm font-black leading-tight text-white shadow-glow">
          Dodaj wydarzenie
        </button>
      </form>

      <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <SectionTitle eyebrow="Plan" title={calendarRangeTitle(calendarMode, focusedDate)} />
          <div className="grid min-w-0 gap-3 sm:flex sm:flex-row sm:items-center">
            <div className="grid grid-cols-3 rounded-md border border-slate-200 bg-mist p-1">
              {(["month", "week", "day"] as CalendarMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCalendarMode(mode)}
                  className={`min-h-10 min-w-0 rounded px-1 text-[11px] font-black transition sm:px-3 sm:text-xs ${
                    calendarMode === mode ? "bg-navy text-white" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {calendarModeLabels[mode]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 rounded-md border border-slate-200 bg-white p-1">
              <button type="button" onClick={() => moveCalendar(-1)} className="min-h-10 rounded px-2 text-sm font-black text-navy hover:bg-mist sm:px-3">‹</button>
              <button type="button" onClick={() => setFocusedDate(new Date())} className="min-h-10 rounded px-2 text-xs font-black text-navy hover:bg-mist sm:px-3">Dziś</button>
              <button type="button" onClick={() => moveCalendar(1)} className="min-h-10 rounded px-2 text-sm font-black text-navy hover:bg-mist sm:px-3">›</button>
            </div>
          </div>
        </div>

        {calendarMode === "month" ? (
          <div className="mt-6 min-w-0 overflow-hidden pb-2">
            <div className="min-w-0">
              <div className="grid grid-cols-7 border-b border-slate-200">
                {weekDayLabels.map((day) => (
                  <p key={day} className="px-2 pb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">{day}</p>
                ))}
              </div>
              <div className="grid grid-cols-7 border-l border-t border-slate-200">
                {monthDays.map((day) => {
                  const items = eventsForDay(sortedEvents, day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-24 min-w-0 border-b border-r border-slate-200 p-1.5 sm:min-h-32 sm:p-2 ${
                        isSameMonth(day, focusedDate) ? "bg-white" : "bg-slate-50 text-slate-400"
                      } ${isSameDay(day, new Date()) ? "ring-2 ring-inset ring-cyan" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setFocusedDate(day);
                            setCalendarMode("day");
                          }}
                          className="h-7 w-7 rounded-full text-xs font-black text-navy hover:bg-mist"
                        >
                          {day.getDate()}
                        </button>
                        {items.length ? <span className="rounded-full bg-teal/10 px-1.5 py-1 text-[10px] font-black text-teal">{items.length}</span> : null}
                      </div>
                      <div className="mt-2 grid gap-1">
                        {items.slice(0, 3).map((item) => renderEventPill(item, true))}
                        {items.length > 3 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFocusedDate(day);
                              setCalendarMode("day");
                            }}
                            className="text-left text-[11px] font-bold text-slate-500 hover:text-navy"
                          >
                            +{items.length - 3} więcej
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {calendarMode === "week" ? (
          <div className="mt-6 overflow-x-auto pb-2">
            <div className="grid min-w-[760px] grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const items = eventsForDay(sortedEvents, day);
                return (
                  <div key={day.toISOString()} className={`min-h-[28rem] rounded-lg border p-3 ${isSameDay(day, new Date()) ? "border-cyan bg-cyan/5" : "border-slate-200 bg-mist"}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setFocusedDate(day);
                        setCalendarMode("day");
                      }}
                      className="text-left"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{weekDayLabels[(day.getDay() + 6) % 7]}</p>
                      <p className="mt-1 text-2xl font-black text-navy">{day.getDate()}</p>
                    </button>
                    <div className="mt-4 grid gap-2">
                      {items.map((item) => renderEventPill(item))}
                      {!items.length ? <p className="text-xs font-semibold text-slate-500">Brak wydarzeń</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {calendarMode === "day" ? (
          <div className="mt-6 grid gap-3">
            {dayEvents.map((item) => (
              <article key={item.id} className="grid gap-3 rounded-lg border border-slate-200 bg-mist p-4 sm:grid-cols-[5rem_1fr_auto] sm:items-start">
                <p className="text-lg font-black text-electric">{formatTime(item.starts_at)}</p>
                <div>
                  <h3 className="font-black text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.description || item.location || item.event_type}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">{item.participant_ids.map(profileName).join(", ") || "Bez uczestników"}</p>
                  {item.ends_at ? <p className="mt-1 text-xs font-bold text-slate-500">Koniec: {formatTime(item.ends_at)}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelectedEventId(item.id)} className="w-fit rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-navy">Szczegóły</button>
                  <button type="button" onClick={() => deleteEvent(item.id)} className="w-fit rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700">Usuń</button>
                </div>
              </article>
            ))}
            {!dayEvents.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak wydarzeń w tym dniu.</p> : null}
          </div>
        ) : null}

        <div className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="font-black text-navy">Wszystkie najbliższe wydarzenia</h3>
          <div className="mt-4 grid gap-3">
            {sortedEvents.slice(0, 6).map((item) => (
              <article key={item.id} className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                <p className="text-sm font-black text-electric">{formatDateTime(item.starts_at)}</p>
                <div>
                  <h4 className="font-black text-navy">{item.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{item.description || item.location || item.event_type}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">{item.participant_ids.map(profileName).join(", ") || "Bez uczestników"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelectedEventId(item.id)} className="w-fit rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-navy hover:bg-mist">Szczegóły</button>
                  <button type="button" onClick={() => deleteEvent(item.id)} className="w-fit rounded-md border border-red-200 px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50">Usuń</button>
                </div>
              </article>
            ))}
            {!sortedEvents.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak wydarzeń.</p> : null}
          </div>
        </div>
      </div>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-navy/55 px-3 py-4 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="calendar-event-title">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-glow sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-electric">Szczegóły wydarzenia</p>
                <h3 id="calendar-event-title" className="mt-2 text-2xl font-black tracking-tight text-navy">{selectedEvent.title}</h3>
                <p className="mt-2 text-sm font-bold text-slate-700">
                  {formatDateTime(selectedEvent.starts_at)}
                  {selectedEvent.ends_at ? ` - ${formatTime(selectedEvent.ends_at)}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedEventId(null)} className="w-fit rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-navy">Zamknij</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Info label="Lokalizacja" value={selectedEvent.location || "Brak lokalizacji"} />
              <Info label="Uczestnicy" value={selectedEvent.participant_ids.map(profileName).join(", ") || "Bez uczestników"} />
              <Info label="Typ" value={selectedEvent.event_type || "Operacyjne"} />
            </div>
            <div className="mt-5 rounded-md border border-slate-200 bg-mist p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Opis</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{selectedEvent.description || "Brak opisu."}</p>
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setSelectedEventId(null)} className="min-h-11 rounded-md border border-slate-200 px-4 text-sm font-black text-navy">Zamknij</button>
              <button type="button" onClick={() => deleteEvent(selectedEvent.id)} className="min-h-11 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-black text-red-700">Usuń wydarzenie</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function NotesView({
  supabase,
  currentUserId,
  profileName,
  reload,
  onError,
  notes,
  targetItemId
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  notes: BoardNote[];
  targetItemId?: string | null;
}) {
  const [draft, setDraft] = useState({ title: "", body: "", category: "operacyjne", is_pinned: false });
  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.category.toLowerCase().includes(q));
  }, [notes, search]);

  useEffect(() => {
    if (!targetItemId) return;
    const el = document.getElementById(`note-${targetItemId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [targetItemId]);

  async function createNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.from("board_notes").insert({ ...draft, created_by: currentUserId });
    if (error) {
      onError(error.message);
      return;
    }
    setDraft({ title: "", body: "", category: "operacyjne", is_pinned: false });
    await reload();
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={createNote} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Notatki" title="Dodaj nową notatkę" />
        <Field label="Tytuł">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" placeholder="Tytuł notatki..." required />
        </Field>
        <Field label="Kategoria">
          <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input" placeholder="np. strategia, finanse, technologia" />
        </Field>
        <Field label="Treść notatki">
          <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="input min-h-36" placeholder="Wpisz treść..." required />
        </Field>
        <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-mist">
          <input type="checkbox" checked={draft.is_pinned} onChange={(e) => setDraft({ ...draft, is_pinned: e.target.checked })} />
          <span>Przypnij notatkę (wyróżnij na dashboardzie)</span>
        </label>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Dodaj notatkę</button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle eyebrow="Baza wiedzy" title="Zapisane notatki" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj notatek..."
            className="input max-w-xs py-2 text-sm"
          />
        </div>

        <div className="mt-6 grid gap-4">
          {filteredNotes.map((item) => {
            const isTarget = targetItemId === item.id;
            return (
              <article
                key={item.id}
                id={`note-${item.id}`}
                className={`rounded-lg border p-4 transition duration-300 ${
                  isTarget ? "ring-2 ring-cyan border-cyan bg-cyan/[0.04]" : "border-slate-200 bg-mist"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-navy">{item.title}</h3>
                    <span className="mt-1 inline-block rounded bg-teal/10 px-2 py-0.5 text-xs font-bold text-teal">
                      {item.category || "Ogólne"}
                    </span>
                  </div>
                  {item.is_pinned ? <span className="rounded-md border border-teal/20 bg-teal/10 px-2 py-1 text-xs font-black text-teal">Przypięta</span> : null}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.body}</p>
                <p className="mt-3 text-xs font-bold text-slate-500">
                  {profileName(item.created_by)} · {formatDateTime(item.updated_at)}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const { error } = await supabase.from("board_notes").update({ is_pinned: !item.is_pinned }).eq("id", item.id);
                      error ? onError(error.message) : await reload();
                    }}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-navy hover:bg-mist"
                  >
                    {item.is_pinned ? "Odepnij" : "Przypnij"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const { error } = await supabase.from("board_notes").delete().eq("id", item.id);
                      error ? onError(error.message) : await reload();
                    }}
                    className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50"
                  >
                    Usuń
                  </button>
                </div>
              </article>
            );
          })}
          {!filteredNotes.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak notatek.</p> : null}
        </div>
      </div>
    </section>
  );
}

function AnnouncementsView({
  supabase,
  currentUserId,
  profileName,
  reload,
  onError,
  announcements,
  targetItemId,
  broadcastPush
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  announcements: BoardAnnouncement[];
  targetItemId?: string | null;
  broadcastPush?: (type: string, data: { title?: string; body?: string; targetUserId?: string; url?: string }) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ title: "", body: "", priority: "important" as AnnouncementPriority, is_pinned: true });

  useEffect(() => {
    if (!targetItemId) return;
    const el = document.getElementById(`announcement-${targetItemId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [targetItemId]);

  async function createAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.from("board_announcements").insert({ ...draft, created_by: currentUserId });
    if (error) {
      onError(error.message);
      return;
    }
    if (draft.priority === "critical" || draft.priority === "important") {
      broadcastPush?.("announcement", { title: draft.title, body: draft.body });
    }
    setDraft({ title: "", body: "", priority: "important", is_pinned: true });
    await reload();
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={createAnnouncement} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Komunikaty" title="Dodaj ważny komunikat" />
        <Field label="Tytuł">
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" placeholder="Tytuł komunikatu..." required />
        </Field>
        <Field label="Priorytet">
          <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as AnnouncementPriority })} className="input">
            <option value="normal">Normalny</option>
            <option value="important">Ważny</option>
            <option value="critical">Krytyczny</option>
          </select>
        </Field>
        <Field label="Treść komunikatu">
          <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="input min-h-32" placeholder="Treść komunikatu..." required />
        </Field>
        <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-mist">
          <input type="checkbox" checked={draft.is_pinned} onChange={(e) => setDraft({ ...draft, is_pinned: e.target.checked })} />
          <span>Pokazuj na dashboardzie głównym</span>
        </label>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Dodaj komunikat</button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Wszystkie komunikaty" title="Lista ogłoszeń zarządu" />
        <div className="mt-6 grid gap-4">
          {announcements.map((item) => {
            const isTarget = targetItemId === item.id;
            return (
              <article
                key={item.id}
                id={`announcement-${item.id}`}
                className={`rounded-lg border p-4 transition duration-300 ${
                  isTarget
                    ? "ring-2 ring-cyan border-cyan bg-cyan/[0.04]"
                    : item.priority === "critical"
                    ? "border-red-200 bg-red-50/80"
                    : "border-slate-200 bg-mist"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-navy">{item.title}</h3>
                    <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${announcementPriorityClass(item.priority)}`}>
                      {announcementPriorityLabels[item.priority]}
                    </span>
                  </div>
                  {item.is_pinned ? <span className="rounded-md border border-teal/20 bg-teal/10 px-2 py-1 text-xs font-black text-teal">Przypięty</span> : null}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.body}</p>
                <p className="mt-3 text-xs font-bold text-slate-500">
                  {profileName(item.created_by)} · {formatDateTime(item.updated_at)}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const { error } = await supabase.from("board_announcements").update({ is_pinned: !item.is_pinned }).eq("id", item.id);
                      error ? onError(error.message) : await reload();
                    }}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-navy hover:bg-mist"
                  >
                    {item.is_pinned ? "Odepnij" : "Przypnij"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const { error } = await supabase.from("board_announcements").delete().eq("id", item.id);
                      error ? onError(error.message) : await reload();
                    }}
                    className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700 hover:bg-red-50"
                  >
                    Usuń
                  </button>
                </div>
              </article>
            );
          })}
          {!announcements.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak komunikatów.</p> : null}
        </div>
      </div>
    </section>
  );
}

function ChatView({
  supabase,
  currentUserId,
  profileName,
  reload,
  onError,
  messages,
  broadcastPush
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  messages: ChatMessage[];
  broadcastPush?: (type: string, data: { title?: string; body?: string; targetUserId?: string; url?: string }) => Promise<void>;
}) {
  const [body, setBody] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanBody = body.trim();
    if (!cleanBody) return;
    setBody("");
    const { error } = await supabase.from("board_chat_messages").insert({ body: cleanBody, created_by: currentUserId });
    if (error) {
      onError(error.message);
      return;
    }
    broadcastPush?.("chat", { body: cleanBody });
    await reload();
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionTitle eyebrow="Chat Zarządu" title="Szybka komunikacja wewnętrzna" />
      <div className="mt-6 grid max-h-[58vh] gap-3 overflow-y-auto pr-1">
        {messages.map((message) => {
          const isMe = message.created_by === currentUserId;
          return (
            <article
              key={message.id}
              className={`rounded-lg border p-4 transition ${
                isMe ? "border-cyan/30 bg-cyan/[0.04] ml-auto max-w-2xl" : "border-slate-200 bg-mist mr-auto max-w-2xl"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-navy">{profileName(message.created_by)}</p>
                <time className="text-xs font-bold text-slate-500">{formatDateTime(message.created_at)}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{message.body}</p>
            </article>
          );
        })}
        {!messages.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak wiadomości.</p> : null}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={send} className="mt-5 flex gap-3">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-label="Nowa wiadomość"
          placeholder="Napisz wiadomość do Zarządu..."
          className="input min-h-12 flex-1"
          autoFocus
        />
        <button className="min-h-12 rounded-md bg-deal-gradient px-6 text-sm font-black text-white shadow-glow transition hover:brightness-110">
          Wyślij
        </button>
      </form>
    </section>
  );
}

function MailView({ supabase }: { supabase: ReturnType<typeof createZarzadSupabaseClient> }) {
  const [templateId, setTemplateId] = useState(mailTemplates[0].id);
  const [recipientsInput, setRecipientsInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "neutral">("neutral");
  const [isSending, setIsSending] = useState(false);
  const selectedTemplate = mailTemplates.find((template) => template.id === templateId) ?? mailTemplates[0];
  const recipients = parseRecipients(recipientsInput);

  async function sendMail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setMessage("");

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    try {
      const response = await fetch("/api/zarzad/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`
        },
        body: JSON.stringify({ templateId, recipients })
      });
      const result = (await response.json()) as { message?: string };
      setMessageType(response.ok ? "success" : "error");
      setMessage(result.message ?? (response.ok ? "Maile zostały wysłane." : "Nie udało się wysłać maili."));
    } catch {
      setMessageType("error");
      setMessage("Nie udało się połączyć z serwerem wysyłki.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <SectionTitle eyebrow="Mail" title="Wysyłka gotowych materiałów do klientów" />
        <span className="w-fit rounded-md border border-electric/20 bg-electric/8 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-electric">
          Osobny mail na każdy adres
        </span>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={sendMail} className="rounded-lg border border-slate-200 bg-mist p-5">
          <Field label="Wzór maila">
            <select value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="input">
              {mailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Adresy odbiorców">
            <textarea
              value={recipientsInput}
              onChange={(event) => setRecipientsInput(event.target.value)}
              placeholder={"adres1@example.com, adres2@example.com\nadres3@example.com"}
              className="input min-h-40"
              required
            />
          </Field>
          <div className="mt-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            Wykryte adresy: <strong className="text-navy">{recipients.length}</strong>
          </div>
          {message ? (
            <p className={`mt-4 rounded-md border px-4 py-3 text-sm font-semibold ${
              messageType === "success" ? "border-teal/20 bg-teal/10 text-teal" : messageType === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-700"
            }`}>
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSending || recipients.length === 0}
            className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Wysyłam..." : "Wyślij osobne maile"}
          </button>
        </form>
        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-teal">Podgląd ustawień</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-navy">{selectedTemplate.name}</h3>
          <dl className="mt-5 grid gap-4 text-sm">
            <Info label="Nadawca" value={selectedTemplate.from} />
            <Info label="Tytuł" value={selectedTemplate.subject} />
            <Info label="Załącznik" value={selectedTemplate.attachment} />
          </dl>
        </aside>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-navy">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="text-sm font-black text-navy">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <dt className="font-black text-navy">{label}</dt>
      <dd className="mt-1 text-slate-700">{value}</dd>
    </div>
  );
}

function InstallPwa() {
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    function beforeInstall(e: Event) {
      e.preventDefault();
      setPromptEvent(e);
    }

    function appInstalled() {
      setInstalled(true);
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", appInstalled);

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as any).standalone);
    if (isStandalone) {
      setInstalled(true);
    }

    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    setIsIos(isIosDevice);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", appInstalled);
    };
  }, []);

  if (installed) return null;

  if (promptEvent) {
    return (
      <button
        type="button"
        onClick={async () => {
          promptEvent.prompt();
          const { outcome } = await promptEvent.userChoice;
          if (outcome === "accepted") {
            setInstalled(true);
          }
          setPromptEvent(null);
        }}
        className="inline-flex h-11 items-center justify-center rounded-md border border-cyan/40 bg-cyan/15 px-3.5 text-xs font-black text-cyan transition hover:bg-cyan/25 whitespace-nowrap"
      >
        + Zainstaluj aplikację
      </button>
    );
  }

  if (isIos && !installed) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={() => setShowIosGuide((prev) => !prev)}
          className="inline-flex h-11 items-center justify-center rounded-md border border-cyan/40 bg-cyan/15 px-3.5 text-xs font-black text-cyan transition hover:bg-cyan/25 whitespace-nowrap"
        >
          📱 Zainstaluj (iPhone)
        </button>
        {showIosGuide ? (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-white/16 bg-[#041738]/98 p-3 shadow-2xl backdrop-blur-xl z-50 text-left text-xs text-white">
            <p className="font-bold text-cyan">Instalacja na iPhone:</p>
            <p className="mt-1 text-slate-300">
              1. Kliknij ikonę udostępnij na dole Safari (kwadrat ze strzałką ⎋).<br />
              2. Wybierz <strong>„Do ekranu początkowego”</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="mt-2 w-full rounded bg-white/10 py-1 text-[11px] font-bold text-white hover:bg-white/20"
            >
              Rozumiem
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
