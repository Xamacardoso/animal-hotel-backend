import { defineConfig } from "prisma/config";
import { ENV } from "./core/config/env";

export default defineConfig({
  schema: "../prisma/schema.prisma",
  migrations: {
    path: "../prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: ENV.DATABASE_URL,
  },
});
