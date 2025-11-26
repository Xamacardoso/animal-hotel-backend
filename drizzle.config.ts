import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/core/config/env";

export default defineConfig({
  schema: "./src/core/database/schema.ts",
  out: "./src/core/database/migrations", // Pasta onde as migrações serão salvas
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL!, 
  }
});