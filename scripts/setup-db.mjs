/**
 * MyLMS — Database Setup Script
 * Run: node scripts/setup-db.mjs
 *
 * Exécute les migrations via l'API Supabase Management.
 * Requires: SUPABASE_ACCESS_TOKEN env variable (Personal Access Token from supabase.com/dashboard/account/tokens)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://efvtdtczpdhitckqkfnz.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = "efvtdtczpdhitckqkfnz";

// Use Supabase Management API to run SQL
async function runSQL(sql, description) {
  console.log(`\n▶ ${description}...`);

  // Try via pg-gateway (Supabase's SQL runner endpoint)
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ Error: ${err.slice(0, 200)}`);
    return false;
  }

  console.log(`  ✓ OK`);
  return true;
}

async function main() {
  if (!process.env.SUPABASE_ACCESS_TOKEN) {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  MyLMS — Database Setup                                          ║
╠══════════════════════════════════════════════════════════════════╣
║  Pour exécuter les migrations automatiquement :                  ║
║  1. Aller sur https://supabase.com/dashboard/account/tokens      ║
║  2. Créer un Personal Access Token                               ║
║  3. Relancer : SUPABASE_ACCESS_TOKEN=xxx node scripts/setup-db.mjs ║
║                                                                  ║
║  OU copier-coller manuellement dans le SQL Editor Supabase :     ║
║  - supabase/migrations/001_initial_schema.sql                    ║
║  - supabase/migrations/002_rls_policies.sql                      ║
║  - supabase/seed.sql                                             ║
╚══════════════════════════════════════════════════════════════════╝
`);
    process.exit(0);
  }

  const schema = readFileSync(join(__dirname, "../supabase/migrations/001_initial_schema.sql"), "utf-8");
  const rls = readFileSync(join(__dirname, "../supabase/migrations/002_rls_policies.sql"), "utf-8");
  const seed = readFileSync(join(__dirname, "../supabase/seed.sql"), "utf-8");

  await runSQL(schema, "Creating schema (tables, triggers, indexes)");
  await runSQL(rls, "Setting up RLS policies");
  await runSQL(seed, "Inserting seed data");

  console.log("\n✅ Database setup complete!\n");
}

main().catch(console.error);
