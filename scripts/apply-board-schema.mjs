import { readFile } from "node:fs/promises";
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

const migrationPath = path.join(projectRoot, "supabase", "migrations", "20260828143000_create_board_panel.sql");
const sql = await readFile(migrationPath, "utf8");
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`;

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

await client.connect();

try {
  await client.query(sql);
  console.log("Board schema applied.");
} finally {
  await client.end();
}
