import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class Migration20240624200006 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "region_country" ADD COLUMN IF NOT EXISTS "metadata" jsonb null, ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT NOW(), ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT NOW(), ADD COLUMN "deleted_at" timestamptz NULL;'
    )
    this.addSql(
      generatePostgresAlterColummnIfExistStatement(
        "region_country",
        ["region_id"],
        `DROP NOT NULL`
      )
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
      generatePostgresAlterColummnIfExistStatement(
        "region_country",
        ["region_id"],
        `SET NOT NULL`
      )
    )
  }
}
