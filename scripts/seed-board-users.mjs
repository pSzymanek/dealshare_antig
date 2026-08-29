import { mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

const projectRoot = process.cwd();
const members = [
  { full_name: "Piotr", email: "piotr@dealshare.pl" },
  { full_name: "Michał", email: "michal@dealshare.pl" },
  { full_name: "Żaneta", email: "zaneta@dealshare.pl" }
];

async function readEnvFile(filePath) {
  const env = {};
  const content = await readFile(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    env[trimmed.slice(0, separator)] = trimmed.slice(separator + 1);
  }

  return env;
}

function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  const bytes = crypto.randomBytes(20);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function supabaseFetch(url, serviceRoleKey, pathname, init = {}) {
  const response = await fetch(`${url}${pathname}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.msg ?? data?.message ?? text;
    throw new Error(`${response.status} ${response.statusText}: ${message}`);
  }

  return data;
}

const env = await readEnvFile(path.join(projectRoot, ".env.local"));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Brakuje NEXT_PUBLIC_SUPABASE_URL albo SUPABASE_SERVICE_ROLE_KEY w .env.local.");
}

const credentials = [];
const profiles = [];

for (const member of members) {
  const password = randomPassword();
  let user;

  try {
    user = await supabaseFetch(supabaseUrl, serviceRoleKey, "/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        email: member.email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: member.full_name
        }
      })
    });
  } catch (error) {
    if (!String(error.message).includes("already")) {
      throw error;
    }

    const existing = await supabaseFetch(supabaseUrl, serviceRoleKey, "/auth/v1/admin/users?page=1&per_page=200", {
      method: "GET"
    });
    user = existing.users.find((item) => item.email?.toLowerCase() === member.email.toLowerCase());

    if (!user) {
      throw error;
    }

    await supabaseFetch(supabaseUrl, serviceRoleKey, `/auth/v1/admin/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({
        password,
        email_confirm: true,
        user_metadata: {
          full_name: member.full_name
        }
      })
    });
  }

  profiles.push({
    id: user.id,
    email: member.email,
    full_name: member.full_name,
    role: "admin",
    is_active: true
  });

  credentials.push({
    name: member.full_name,
    email: member.email,
    temporaryPassword: password
  });
}

await mkdir(path.join(projectRoot, ".local"), { recursive: true });
await writeFile(
  path.join(projectRoot, ".local", "board-users-credentials.json"),
  JSON.stringify(credentials, null, 2),
  "utf8"
);

const profilesSql = `insert into public.board_profiles (id, email, full_name, role, is_active)
values
${profiles
  .map(
    (profile) =>
      `  ('${profile.id}', '${profile.email}', '${profile.full_name.replaceAll("'", "''")}', '${profile.role}', ${profile.is_active})`
  )
  .join(",\n")}
on conflict (id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    is_active = excluded.is_active,
    updated_at = now();`;

await writeFile(path.join(projectRoot, ".local", "board-profile-upsert.sql"), profilesSql, "utf8");

try {
  await supabaseFetch(supabaseUrl, serviceRoleKey, "/rest/v1/board_profiles", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify(profiles)
  });

  console.log("Board users seeded. Credentials saved to .local/board-users-credentials.json.");
} catch (error) {
  console.error(error.message);
  console.error("Auth users were created/updated. Profile SQL saved to .local/board-profile-upsert.sql.");
  process.exitCode = 2;
}
