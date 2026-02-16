
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not found in environment");

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/schema.ts",
  dialect: "postgresql",
  schemaFilter: ["indie_hq"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
