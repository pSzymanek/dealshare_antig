import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

const projectRoot = process.cwd();

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

const env = await readEnvFile(path.join(projectRoot, ".env.local"));
const projectRef = env.SUPABASE_PROJECT_REF;
const dbPassword = env.SUPABASE_DB_PASSWORD;

if (!projectRef || !dbPassword) {
  throw new Error("Brakuje SUPABASE_PROJECT_REF albo SUPABASE_DB_PASSWORD w .env.local.");
}

const migrationsDir = path.join(projectRoot, "supabase", "migrations");
const migrationFiles = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

await client.connect();

try {
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = await readFile(filePath, "utf8");
    console.log(`Stosowanie migracji: ${file}...`);
    await client.query(sql);
  }
  console.log("Wszystkie schematy bazy danych zostały pomyślnie wdrożone w Supabase!");
} finally {
  await client.end();
}
