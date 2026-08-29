"use client";

import Image from "next/image";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ZarzadLogin } from "@/components/zarzad/ZarzadLogin";
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
  medium: "Normalny",
  high: "Wysoki",
  urgent: "Pilne"
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-black tracking-tight text-navy sm:text-2xl">{title}</h2>
    </div>
  );
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Bez terminu";
  }

  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDayTitle(value: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(value);
}

function formatMonthTitle(value: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric"
  }).format(value);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value: Date, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

function addMonths(value: Date, months: number) {
  const date = new Date(value);
  date.setMonth(date.getMonth() + months);
  return date;
}

function startOfWeek(value: Date) {
  const date = startOfDay(value);
  const day = date.getDay() || 7;
  return addDays(date, 1 - day);
}

function isSameDay(first: Date, second: Date) {
  return startOfDay(first).getTime() === startOfDay(second).getTime();
}

function isSameMonth(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

function getMonthGrid(value: Date) {
  const firstDay = new Date(value.getFullYear(), value.getMonth(), 1);
  const gridStart = startOfWeek(firstDay);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function eventsForDay(events: BoardEvent[], day: Date) {
  const dayStart = startOfDay(day).getTime();
  const dayEnd = addDays(startOfDay(day), 1).getTime();

  return events.filter((event) => {
    const eventStart = new Date(event.starts_at).getTime();
    const eventEnd = event.ends_at ? new Date(event.ends_at).getTime() : eventStart;
    return eventStart < dayEnd && eventEnd >= dayStart;
  });
}

function calendarRangeTitle(mode: CalendarMode, focusedDate: Date) {
  if (mode === "month") {
    return formatMonthTitle(focusedDate);
  }

  if (mode === "week") {
    const weekStart = startOfWeek(focusedDate);
    const weekEnd = addDays(weekStart, 6);
    return `${formatDayTitle(weekStart)} - ${formatDayTitle(weekEnd)}`;
  }

  return formatDayTitle(focusedDate);
}

function toDateTimeLocal(value: Date) {
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function parseRecipients(value: string) {
  return Array.from(new Set(value.split(/[\s,;]+/).map((recipient) => recipient.trim()).filter(Boolean)));
}

function statusClass(status: TaskStatus) {
  if (status === "done") {
    return "border-teal/20 bg-teal/10 text-teal";
  }

  if (status === "doing") {
    return "border-electric/20 bg-electric/8 text-electric";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function priorityClass(priority: TaskPriority | AnnouncementPriority) {
  if (priority === "urgent" || priority === "critical") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (priority === "high" || priority === "important") {
    return "border-electric/20 bg-electric/8 text-electric";
  }

  return "border-slate-200 bg-white text-slate-600";
}

function InstallPwa() {
  const [canInstall, setCanInstall] = useState(false);
  const [installEvent, setInstallEvent] = useState<Event | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/zarzad-sw.js").catch(() => undefined);
      } else {
        navigator.serviceWorker.getRegistrations()
          .then((registrations) => {
            registrations
              .filter((registration) => registration.active?.scriptURL.endsWith("/zarzad-sw.js"))
              .forEach((registration) => {
                void registration.unregister();
              });
          })
          .catch(() => undefined);
      }
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  async function install() {
    const promptEvent = installEvent as Event & {
      prompt?: () => Promise<void>;
      userChoice?: Promise<{ outcome: string }>;
    };

    await promptEvent.prompt?.();
    await promptEvent.userChoice?.catch(() => undefined);
    setCanInstall(false);
  }

  return (
    <button
      type="button"
      onClick={install}
      disabled={!canInstall}
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/14 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-55"
    >
      Zainstaluj
    </button>
  );
}

export function ZarzadApp() {
  const supabase = useMemo(() => createZarzadSupabaseClient(), []);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [events, setEvents] = useState<BoardEvent[]>([]);
  const [notes, setNotes] = useState<BoardNote[]>([]);
  const [announcements, setAnnouncements] = useState<BoardAnnouncement[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const profileName = useCallback(
    (id: string | null | undefined) => profiles.find((profile) => profile.id === id)?.full_name ?? "Nieprzypisane",
    [profiles]
  );

  const loadBoard = useCallback(async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    const [profilesResult, tasksResult, eventsResult, notesResult, announcementsResult, messagesResult] = await Promise.all([
      supabase.from("board_profiles").select("*").order("full_name", { ascending: true }),
      supabase.from("board_tasks").select("*").order("updated_at", { ascending: false }),
      supabase.from("board_calendar_events").select("*").order("starts_at", { ascending: true }),
      supabase.from("board_notes").select("*").order("is_pinned", { ascending: false }).order("updated_at", { ascending: false }),
      supabase.from("board_announcements").select("*").order("is_pinned", { ascending: false }).order("updated_at", { ascending: false }),
      supabase.from("board_chat_messages").select("*").order("created_at", { ascending: true }).limit(80)
    ]);

    const error = profilesResult.error ?? tasksResult.error ?? eventsResult.error ?? notesResult.error ?? announcementsResult.error ?? messagesResult.error;

    if (error) {
      setNotice(error.message);
    } else {
      setProfiles((profilesResult.data ?? []) as Profile[]);
      setTasks((tasksResult.data ?? []) as BoardTask[]);
      setEvents((eventsResult.data ?? []) as BoardEvent[]);
      setNotes((notesResult.data ?? []) as BoardNote[]);
      setAnnouncements((announcementsResult.data ?? []) as BoardAnnouncement[]);
      setMessages((messagesResult.data ?? []) as ChatMessage[]);
      setNotice("");
    }

    setLoading(false);
  }, [session, supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBoard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadBoard]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const channel = supabase
      .channel("dealshare-board-panel")
      .on("postgres_changes", { event: "*", schema: "public", table: "board_tasks" }, () => void loadBoard())
      .on("postgres_changes", { event: "*", schema: "public", table: "board_calendar_events" }, () => void loadBoard())
      .on("postgres_changes", { event: "*", schema: "public", table: "board_notes" }, () => void loadBoard())
      .on("postgres_changes", { event: "*", schema: "public", table: "board_announcements" }, () => void loadBoard())
      .on("postgres_changes", { event: "*", schema: "public", table: "board_chat_messages" }, () => void loadBoard())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadBoard, session, supabase]);

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!authReady) {
    return <main className="grid min-h-screen place-items-center bg-navy-gradient px-5 text-white">Ładowanie panelu...</main>;
  }

  if (!session) {
    return <ZarzadLogin onSignedIn={() => void supabase.auth.getSession().then(({ data }) => setSession(data.session))} />;
  }

  const currentUserId = session.user.id;
  const today = new Date();
  const recentEventThreshold = new Date(today.getTime() - 60 * 60 * 1000);
  const overdueTasks = tasks.filter((task) => task.status !== "done" && task.due_at && new Date(task.due_at) < today);
  const openTasks = tasks.filter((task) => task.status !== "done");
  const upcomingEvents = events.filter((event) => new Date(event.starts_at) >= recentEventThreshold).slice(0, 5);
  const pinnedNotes = notes.filter((note) => note.is_pinned).slice(0, 3);
  const pinnedAnnouncements = announcements.filter((announcement) => announcement.is_pinned).slice(0, 3);

  const commonProps = {
    supabase,
    currentUserId,
    profiles,
    profileName,
    reload: loadBoard,
    onError: setNotice
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
            <div className="flex gap-2">
              <InstallPwa />
              <button type="button" onClick={logout} className="min-h-11 rounded-md border border-white/14 bg-white px-4 text-sm font-black text-navy">
                Wyloguj
              </button>
            </div>
          </div>

          <nav className="board-nav-desktop grid-cols-7 gap-2 rounded-lg border border-white/10 bg-white/8 p-2 backdrop-blur">
            {tabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
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
          <TabButton key={tab.id} tab={tab} activeTab={activeTab} setActiveTab={setActiveTab} compact />
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
  profileName
}: {
  tasks: BoardTask[];
  upcomingEvents: BoardEvent[];
  overdueTasks: BoardTask[];
  openTasks: BoardTask[];
  pinnedNotes: BoardNote[];
  pinnedAnnouncements: BoardAnnouncement[];
  messages: ChatMessage[];
  profileName: (id?: string | null) => string;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle eyebrow="Aktualny obraz" title="Najważniejsze sprawy zarządu" />
          <span className="w-fit rounded-md border border-teal/20 bg-teal/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-teal">Supabase live</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Otwarte zadania", openTasks.length],
            ["Po terminie", overdueTasks.length],
            ["Wydarzenia", upcomingEvents.length],
            ["Wiadomości", messages.length]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-mist p-4">
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <p className="mt-3 text-3xl font-black text-navy">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3">
          {overdueTasks.length ? (
            overdueTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-red-700">Po terminie</p>
                <h3 className="mt-1 font-black text-navy">{task.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{profileName(task.assigned_to)} · {formatDateTime(task.due_at)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-navy p-5 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan">Stan dnia</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">Brak zadań po terminie</h3>
              <p className="mt-3 text-sm leading-7 text-white/72">Dashboard zbiera kalendarz, zadania, notatki, komunikaty i chat w jeden operacyjny widok.</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5">
        <SummaryList title="Najbliższe wydarzenia" empty="Brak wydarzeń" items={upcomingEvents.map((event) => `${formatDateTime(event.starts_at)} · ${event.title}`)} />
        <SummaryList title="Przypięte komunikaty" empty="Brak przypiętych komunikatów" items={pinnedAnnouncements.map((announcement) => announcement.title)} />
        <SummaryList title="Przypięte notatki" empty="Brak przypiętych notatek" items={pinnedNotes.map((note) => note.title)} />
        <SummaryList title="Ostatni chat" empty="Brak wiadomości" items={messages.slice(-3).map((message) => `${profileName(message.created_by)}: ${message.body}`)} />
        <SummaryList title="Ostatnie zadania" empty="Brak zadań" items={tasks.slice(0, 4).map((task) => `${statusLabels[task.status]} · ${task.title}`)} />
      </section>
    </div>
  );
}

function SummaryList({ title, empty, items }: { title: string; empty: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-black text-navy">{title}</h3>
      <div className="mt-4 grid gap-2">
        {items.length ? items.map((item) => <p key={item} className="rounded-md border border-slate-200 bg-mist px-3 py-2 text-sm font-semibold text-slate-700">{item}</p>) : <p className="text-sm text-slate-500">{empty}</p>}
      </div>
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
  tasks
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profiles: Profile[];
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  tasks: BoardTask[];
}) {
  const [draft, setDraft] = useState({ title: "", description: "", priority: "medium" as TaskPriority, due_at: "", assigned_to: "" });

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
        <SectionTitle eyebrow="Nowe zadanie" title="Dodaj do listy" />
        <Field label="Tytuł"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" required /></Field>
        <Field label="Opis"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input min-h-28" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Priorytet"><select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as TaskPriority })} className="input">{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
          <Field label="Termin"><input type="datetime-local" value={draft.due_at} onChange={(e) => setDraft({ ...draft, due_at: e.target.value })} className="input" /></Field>
        </div>
        <Field label="Odpowiedzialny"><select value={draft.assigned_to} onChange={(e) => setDraft({ ...draft, assigned_to: e.target.value })} className="input"><option value="">Nieprzypisane</option>{profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.full_name}</option>)}</select></Field>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Dodaj zadanie</button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Zadania" title="Lista operacyjna" />
        <div className="mt-6 grid gap-3">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-black text-navy">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{task.description || "Bez opisu"}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">{profileName(task.assigned_to)} · {formatDateTime(task.due_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-md border px-3 py-2 text-xs font-bold ${statusClass(task.status)}`}>{statusLabels[task.status]}</span>
                  <span className={`rounded-md border px-3 py-2 text-xs font-bold ${priorityClass(task.priority)}`}>{priorityLabels[task.priority]}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:flex">
                {(["todo", "doing", "done"] as TaskStatus[]).map((status) => <button key={status} type="button" onClick={() => updateTask(task.id, { status })} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-navy">{statusLabels[status]}</button>)}
                <button type="button" onClick={() => deleteTask(task.id)} className="rounded-md border border-red-200 px-3 py-2 text-xs font-black text-red-700">Usuń</button>
              </div>
            </article>
          ))}
          {!tasks.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak zadań.</p> : null}
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
  events
}: {
  supabase: ReturnType<typeof createZarzadSupabaseClient>;
  currentUserId: string;
  profiles: Profile[];
  profileName: (id?: string | null) => string;
  reload: () => Promise<void>;
  onError: (message: string) => void;
  events: BoardEvent[];
}) {
  const [draft, setDraft] = useState({ title: "", description: "", starts_at: toDateTimeLocal(new Date()), ends_at: "", location: "", event_type: "operacyjne", participant_ids: [] as string[] });
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const [focusedDate, setFocusedDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const sortedEvents = useMemo(() => [...events].sort((first, second) => new Date(first.starts_at).getTime() - new Date(second.starts_at).getTime()), [events]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(focusedDate), index)), [focusedDate]);
  const monthDays = useMemo(() => getMonthGrid(focusedDate), [focusedDate]);
  const dayEvents = useMemo(() => eventsForDay(sortedEvents, focusedDate), [focusedDate, sortedEvents]);
  const selectedEvent = useMemo(() => sortedEvents.find((event) => event.id === selectedEventId) ?? null, [selectedEventId, sortedEvents]);

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

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
    setDraft((current) => ({ ...current, participant_ids: current.participant_ids.includes(id) ? current.participant_ids.filter((item) => item !== id) : [...current.participant_ids, id] }));
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
      <button key={event.id} type="button" onClick={() => setSelectedEventId(event.id)} className="min-w-0 rounded-md border border-electric/20 bg-electric/8 px-2 py-1 text-left transition hover:border-electric hover:bg-electric/12">
        <p className={`${compact ? "text-[10px]" : "text-xs"} font-black leading-tight text-electric`}>{formatTime(event.starts_at)}</p>
        <p className={`${compact ? "line-clamp-1 text-[11px]" : "text-sm"} font-bold leading-snug text-navy`}>{event.title}</p>
      </button>
    );
  }

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[0.7fr_1.3fr]">
      <form onSubmit={createEvent} className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Kalendarz" title="Dodaj wydarzenie" />
        <Field label="Tytuł"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" required /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start"><input type="datetime-local" value={draft.starts_at} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} className="input" required /></Field>
          <Field label="Koniec"><input type="datetime-local" value={draft.ends_at} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })} className="input" /></Field>
        </div>
        <Field label="Lokalizacja"><input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className="input" /></Field>
        <Field label="Opis"><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input min-h-24" /></Field>
        <div className="mt-4">
          <p className="text-sm font-black text-navy">Uczestnicy</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {profiles.map((profile) => (
              <label key={profile.id} className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700">
                <input type="checkbox" checked={draft.participant_ids.includes(profile.id)} onChange={() => toggleParticipant(profile.id)} />
                {profile.full_name}
              </label>
            ))}
          </div>
        </div>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-4 py-3 text-sm font-black leading-tight text-white shadow-glow">Dodaj wydarzenie</button>
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
                  className={`min-h-10 min-w-0 rounded px-1 text-[11px] font-black transition sm:px-3 sm:text-xs ${calendarMode === mode ? "bg-navy text-white" : "text-slate-600 hover:bg-white"}`}
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
                    <div key={day.toISOString()} className={`min-h-24 min-w-0 border-b border-r border-slate-200 p-1.5 sm:min-h-32 sm:p-2 ${isSameMonth(day, focusedDate) ? "bg-white" : "bg-slate-50 text-slate-400"} ${isSameDay(day, new Date()) ? "ring-2 ring-inset ring-cyan" : ""}`}>
                      <div className="flex items-center justify-between">
                        <button type="button" onClick={() => { setFocusedDate(day); setCalendarMode("day"); }} className="h-7 w-7 rounded-full text-xs font-black text-navy hover:bg-mist">
                          {day.getDate()}
                        </button>
                        {items.length ? <span className="rounded-full bg-teal/10 px-1.5 py-1 text-[10px] font-black text-teal">{items.length}</span> : null}
                      </div>
                      <div className="mt-2 grid gap-1">
                        {items.slice(0, 3).map((item) => renderEventPill(item, true))}
                        {items.length > 3 ? (
                          <button type="button" onClick={() => { setFocusedDate(day); setCalendarMode("day"); }} className="text-left text-[11px] font-bold text-slate-500 hover:text-navy">
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
                    <button type="button" onClick={() => { setFocusedDate(day); setCalendarMode("day"); }} className="text-left">
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
          <h3 className="font-black text-navy">Najbliższe wydarzenia</h3>
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
                  <button type="button" onClick={() => setSelectedEventId(item.id)} className="w-fit rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-navy">Szczegóły</button>
                  <button type="button" onClick={() => deleteEvent(item.id)} className="w-fit rounded-md border border-red-200 px-3 py-2 text-xs font-black text-red-700">Usuń</button>
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
function NotesView({ supabase, currentUserId, profileName, reload, onError, notes }: { supabase: ReturnType<typeof createZarzadSupabaseClient>; currentUserId: string; profileName: (id?: string | null) => string; reload: () => Promise<void>; onError: (message: string) => void; notes: BoardNote[] }) {
  const [draft, setDraft] = useState({ title: "", body: "", category: "operacyjne", is_pinned: false });

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
        <SectionTitle eyebrow="Notatki" title="Dodaj notatkę" />
        <Field label="Tytuł"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" required /></Field>
        <Field label="Kategoria"><input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="input" /></Field>
        <Field label="Treść"><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="input min-h-36" required /></Field>
        <label className="mt-4 flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={draft.is_pinned} onChange={(e) => setDraft({ ...draft, is_pinned: e.target.checked })} /> Przypnij</label>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Dodaj notatkę</button>
      </form>
      <CardsGrid items={notes.map((note) => ({ id: note.id, title: note.title, body: note.body, meta: `${note.category} · ${profileName(note.created_by)} · ${formatDateTime(note.updated_at)}`, pinned: note.is_pinned }))} onToggle={async (id, pinned) => { const { error } = await supabase.from("board_notes").update({ is_pinned: !pinned }).eq("id", id); error ? onError(error.message) : await reload(); }} onDelete={async (id) => { const { error } = await supabase.from("board_notes").delete().eq("id", id); error ? onError(error.message) : await reload(); }} />
    </section>
  );
}

function AnnouncementsView({ supabase, currentUserId, profileName, reload, onError, announcements }: { supabase: ReturnType<typeof createZarzadSupabaseClient>; currentUserId: string; profileName: (id?: string | null) => string; reload: () => Promise<void>; onError: (message: string) => void; announcements: BoardAnnouncement[] }) {
  const [draft, setDraft] = useState({ title: "", body: "", priority: "important" as AnnouncementPriority, is_pinned: true });

  async function createAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { error } = await supabase.from("board_announcements").insert({ ...draft, created_by: currentUserId });
    if (error) {
      onError(error.message);
      return;
    }
    setDraft({ title: "", body: "", priority: "important", is_pinned: true });
    await reload();
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={createAnnouncement} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <SectionTitle eyebrow="Komunikaty" title="Dodaj ważny komunikat" />
        <Field label="Tytuł"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="input" required /></Field>
        <Field label="Priorytet"><select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as AnnouncementPriority })} className="input"><option value="normal">Normalny</option><option value="important">Ważny</option><option value="critical">Krytyczny</option></select></Field>
        <Field label="Treść"><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="input min-h-32" required /></Field>
        <label className="mt-4 flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={draft.is_pinned} onChange={(e) => setDraft({ ...draft, is_pinned: e.target.checked })} /> Pokazuj na dashboardzie</label>
        <button className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Dodaj komunikat</button>
      </form>
      <CardsGrid items={announcements.map((item) => ({ id: item.id, title: item.title, body: item.body, meta: `${item.priority} · ${profileName(item.created_by)} · ${formatDateTime(item.updated_at)}`, pinned: item.is_pinned, tone: item.priority }))} onToggle={async (id, pinned) => { const { error } = await supabase.from("board_announcements").update({ is_pinned: !pinned }).eq("id", id); error ? onError(error.message) : await reload(); }} onDelete={async (id) => { const { error } = await supabase.from("board_announcements").delete().eq("id", id); error ? onError(error.message) : await reload(); }} />
    </section>
  );
}

function CardsGrid({ items, onToggle, onDelete }: { items: Array<{ id: string; title: string; body: string; meta: string; pinned: boolean; tone?: string }>; onToggle: (id: string, pinned: boolean) => void; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item.id} className={`rounded-lg border p-4 ${item.tone === "critical" ? "border-red-200 bg-red-50" : "border-slate-200 bg-mist"}`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-black text-navy">{item.title}</h3>
              {item.pinned ? <span className="rounded-md border border-teal/20 bg-teal/10 px-2 py-1 text-xs font-black text-teal">Pin</span> : null}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.body}</p>
            <p className="mt-3 text-xs font-bold text-slate-500">{item.meta}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => onToggle(item.id, item.pinned)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black text-navy">{item.pinned ? "Odepnij" : "Przypnij"}</button>
              <button type="button" onClick={() => onDelete(item.id)} className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700">Usuń</button>
            </div>
          </article>
        ))}
        {!items.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak wpisów.</p> : null}
      </div>
    </div>
  );
}

function ChatView({ supabase, currentUserId, profileName, reload, onError, messages }: { supabase: ReturnType<typeof createZarzadSupabaseClient>; currentUserId: string; profileName: (id?: string | null) => string; reload: () => Promise<void>; onError: (message: string) => void; messages: ChatMessage[] }) {
  const [body, setBody] = useState("");

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
    await reload();
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionTitle eyebrow="Chat" title="Szybka komunikacja zarządu" />
      <div className="mt-6 grid max-h-[58vh] gap-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <article key={message.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-navy">{profileName(message.created_by)}</p>
              <time className="text-xs font-bold text-slate-500">{formatDateTime(message.created_at)}</time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{message.body}</p>
          </article>
        ))}
        {!messages.length ? <p className="rounded-md border border-slate-200 bg-mist p-4 text-sm text-slate-600">Brak wiadomości.</p> : null}
      </div>
      <form onSubmit={send} className="mt-5 flex gap-3">
        <input value={body} onChange={(event) => setBody(event.target.value)} aria-label="Nowa wiadomość" placeholder="Napisz wiadomość..." className="input min-h-12 flex-1" />
        <button className="min-h-12 rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow">Wyślij</button>
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
        <SectionTitle eyebrow="Mail" title="Wysyłka gotowych maili do klientów" />
        <span className="w-fit rounded-md border border-electric/20 bg-electric/8 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-electric">Osobny mail na każdy adres</span>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={sendMail} className="rounded-lg border border-slate-200 bg-mist p-5">
          <Field label="Wzór maila"><select value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="input">{mailTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></Field>
          <Field label="Adresy odbiorców"><textarea value={recipientsInput} onChange={(event) => setRecipientsInput(event.target.value)} placeholder={"adres1@example.com, adres2@example.com\nadres3@example.com"} className="input min-h-40" required /></Field>
          <div className="mt-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">Wykryte adresy: <strong className="text-navy">{recipients.length}</strong></div>
          {message ? <p className={`mt-4 rounded-md border px-4 py-3 text-sm font-semibold ${messageType === "success" ? "border-teal/20 bg-teal/10 text-teal" : messageType === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-700"}`}>{message}</p> : null}
          <button type="submit" disabled={isSending || recipients.length === 0} className="mt-5 min-h-12 w-full rounded-md bg-deal-gradient px-5 text-sm font-black text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60">{isSending ? "Wysyłam..." : "Wyślij osobne maile"}</button>
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
