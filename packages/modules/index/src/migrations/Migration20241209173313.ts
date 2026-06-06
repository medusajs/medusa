import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241209173313 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "index_data"
      ADD COLUMN IF NOT EXISTS "created_at" timestamptz NOT NULL DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "updated_at" timestamptz NOT NULL DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "deleted_at" timestamptz NULL;
    `)

    this.addSql(`
      ALTER TABLE "index_relation"
      ADD COLUMN IF NOT EXISTS "created_at" timestamptz NOT NULL DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "updated_at" timestamptz NOT NULL DEFAULT now(),
      ADD COLUMN IF NOT EXISTS "deleted_at" timestamptz NULL;
    `)
  }

  async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE "index_data"
      DROP COLUMN IF EXISTS "created_at",
      DROP COLUMN IF EXISTS "updated_at",
      DROP COLUMN IF EXISTS "deleted_at";
    `)

    this.addSql(`
      ALTER TABLE "index_relation"
      DROP COLUMN IF EXISTS "created_at",
      DROP COLUMN IF EXISTS "updated_at",
      DROP COLUMN IF EXISTS "deleted_at";
    `)
  }
}
