import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class Migration20240624200006 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" ADD COLUMN IF NOT EXISTS "metadata" jsonb null, ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT NOW(), ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT NOW(), ADD COLUMN "deleted_at" timestamptz NULL;'
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" DROP CONSTRAINT IF EXISTS "region_country_region_id_foreign";'
    )
    this.addSql(
      generatePostgresAlterColummnIfExistStatement(
        "region_country",
        ["region_id"],
        `DROP NOT NULL`
      )
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" ADD CONSTRAINT "region_country_region_id_foreign" FOREIGN KEY ("region_id") REFERENCES "region" ("id") ON UPDATE CASCADE ON DELETE SET NULL;'
    )
    // The old index did not take into account the deleted_at column, so we drop it before creating the new one
    this.addSql(
      'DROP INDEX IF EXISTS "IDX_region_country_region_id_iso_2_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_region_country_region_id_iso_2_unique" ON "region_country" (region_id, iso_2) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" DROP COLUMN IF EXISTS "metadata";'
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" DROP COLUMN IF EXISTS "created_at";'
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" DROP COLUMN IF EXISTS "updated_at";'
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" DROP COLUMN IF EXISTS "deleted_at";'
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" DROP CONSTRAINT IF EXISTS "region_country_region_id_foreign";'
    )
    this.addSql(
      generatePostgresAlterColummnIfExistStatement(
        "region_country",
        ["region_id"],
        `SET NOT NULL`
      )
    )
    this.addSql(
      'DROP INDEX IF EXISTS "IDX_region_country_region_id_iso_2_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_region_country_region_id_iso_2_unique" ON "region_country" (region_id, iso_2);'
    )
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" ADD CONSTRAINT "region_country_region_id_foreign" FOREIGN KEY ("region_id") REFERENCES "region" ("id") ON UPDATE CASCADE;'
    )
  }
}
