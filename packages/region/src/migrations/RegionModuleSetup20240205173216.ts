import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class RegionModuleSetup20240205173216 extends Migration {
  async up(): Promise<void> {
    const regionExists = await this.execute(
      "SELECT * FROM information_schema.tables WHERE table_name = 'region' AND table_schema = 'public'"
    )

    if (regionExists.length) {
      this.addSql(`
      CREATE TABLE IF NOT EXISTS "region_currency" (
        "code" text NOT NULL,
        "symbol" text NOT NULL,
        "symbol_native" text NOT NULL,
        "name" text NOT NULL,
        CONSTRAINT "region_currency_pkey" PRIMARY KEY ("code")
      );

      CREATE TABLE IF NOT EXISTS "region_country" (
        "id" text NOT NULL,
        "iso_2" text NOT NULL,
        "iso_3" text NOT NULL,
        "num_code" int NOT NULL,
        "name" text NOT NULL,
        "display_name" text NOT NULL,
        "region_id" text NULL,
        CONSTRAINT "region_country_pkey" PRIMARY KEY ("id")
      );

      ALTER TABLE "region" DROP CONSTRAINT IF EXISTS "FK_3bdd5896ec93be2f1c62a3309a5";
      ALTER TABLE "region" DROP CONSTRAINT IF EXISTS "FK_91f88052197680f9790272aaf5b";

      ${generatePostgresAlterColummnIfExistStatement(
        "region",
        ["tax_rate", "gift_cards_taxable", "automatic_taxes", "includes_tax"],
        "DROP NOT NULL"
      )}

      CREATE INDEX IF NOT EXISTS "IDX_region_currency_code" ON "region" ("currency_code");
      CREATE INDEX IF NOT EXISTS "IDX_region_deleted_at" ON "region" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
    `)
    } else {
      this.addSql(`
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

      CREATE TABLE IF NOT EXISTS "region_currency" (
        "code" text NOT NULL,
        "symbol" text NOT NULL,
        "symbol_native" text NOT NULL,
        "name" text NOT NULL,
        CONSTRAINT "region_currency_pkey" PRIMARY KEY ("code")
      );
      
      ALTER TABLE "region" ADD CONSTRAINT "region_currency_code_foreign" FOREIGN KEY ("currency_code") REFERENCES "region_currency" ("code") ON UPDATE CASCADE;
      
      CREATE TABLE IF NOT EXISTS "region_country" (
        "id" text NOT NULL,
        "iso_2" text NOT NULL,
        "iso_3" text NOT NULL,
        "num_code" int NOT NULL,
        "name" text NOT NULL,
        "display_name" text NOT NULL,
        "region_id" text NULL,
        CONSTRAINT "region_country_pkey" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_region_country_region_id_iso_2_unique" ON "region_country" (region_id, iso_2);
      
      ALTER TABLE "region_country" ADD CONSTRAINT "region_country_region_id_foreign" FOREIGN KEY ("region_id") REFERENCES "region" ("id") ON UPDATE CASCADE;

      CREATE INDEX IF NOT EXISTS "IDX_region_currency_code" ON "region" ("currency_code");
      CREATE INDEX IF NOT EXISTS "IDX_region_deleted_at" ON "region" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
      `)
    }
  }
}
