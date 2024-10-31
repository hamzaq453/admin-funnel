import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from 'postgres'

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const migrationClient = postgres(DATABASE_URL, { max: 1 });
const db: PostgresJsDatabase = drizzle(migrationClient);

const main = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};

main();

// Steps for DB migrations
// 1. Create  a migration with pnpm drizzle-kit generate:pg
// 2. Run the migrations with pnpm tsx ./dbMigrate.ts