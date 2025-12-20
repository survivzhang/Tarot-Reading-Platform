import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Rely on environment variable for database connection
    url: process.env.DATABASE_URL!,
  },
});

