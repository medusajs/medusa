"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionModuleSetup20240205173216 = void 0;
const utils_1 = require("@medusajs/utils");
const migrations_1 = require("@mikro-orm/migrations");
class RegionModuleSetup20240205173216 extends migrations_1.Migration {
    async up() {
        this.addSql(`
-- Create or update "region" table
CREATE TABLE IF NOT EXISTS "region" (
  "id" text NOT NULL,
  "name" text NOT NULL,
  "currency_code" text NOT NULL,
  "metadata" jsonb NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "deleted_at" timestamptz NULL,
  CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);
-- Adjust "region" table
ALTER TABLE "region" DROP CONSTRAINT IF EXISTS "FK_3bdd5896ec93be2f1c62a3309a5";
ALTER TABLE "region" DROP CONSTRAINT IF EXISTS "FK_91f88052197680f9790272aaf5b";
${(0, utils_1.generatePostgresAlterColummnIfExistStatement)("region", ["tax_rate", "gift_cards_taxable", "includes_tax"], "DROP NOT NULL")}
ALTER TABLE "region" ADD COLUMN IF NOT EXISTS "automatic_taxes" BOOLEAN NOT NULL DEFAULT TRUE;
CREATE INDEX IF NOT EXISTS "IDX_region_deleted_at" ON "region" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
-- Create or update "region_country" table
CREATE TABLE IF NOT EXISTS "region_country" (
  "iso_2" text NOT NULL,
  "iso_3" text NOT NULL,
  "num_code" int NOT NULL,
  "name" text NOT NULL,
  "display_name" text NOT NULL,
  "region_id" text NULL,
  CONSTRAINT "region_country_pkey" PRIMARY KEY ("iso_2")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_region_country_region_id_iso_2_unique" ON "region_country" (region_id, iso_2);
-- Adjust foreign keys for "region_country"
ALTER TABLE "region_country" DROP CONSTRAINT IF EXISTS "FK_91f88052197680f9790272aaf5b";
ALTER TABLE "region_country" ADD CONSTRAINT "region_country_region_id_foreign" FOREIGN KEY ("region_id") REFERENCES "region" ("id") ON UPDATE CASCADE ON DELETE SET NULL;
`);
    }
}
exports.RegionModuleSetup20240205173216 = RegionModuleSetup20240205173216;
