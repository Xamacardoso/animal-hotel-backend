import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ENV } from '../config/env';
import * as schema from './schema';
import path from "path";

// Cria o cliente DB (Pool) usando a ENV carregada
const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});
const db = drizzle(pool, { schema });

async function runMigration() {
  console.log("-> Iniciando migração do Drizzle...");
  
  const migrationsFolder = path.join(process.cwd(), "src", "core", "database", "migrations");

  // O Drizzle Kit salva as migrações na pasta './drizzle'
  await migrate(db, { migrationsFolder });
  
  console.log("-> Migração finalizada com sucesso.");
  await pool.end();
  process.exit(0);
}

runMigration().catch((error) => {
  console.error("Erro durante a migração:", error);
  process.exit(1);
});