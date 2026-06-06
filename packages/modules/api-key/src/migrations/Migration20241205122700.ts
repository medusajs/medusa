import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241205122700 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "api_key" add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'alter table if exists "api_key" alter column "type" type text using ("type"::text);'
    )
    this.addSql(
      'alter table if exists "api_key" add constraint "api_key_type_check" check ("type" in (\'publishable\', \'secret\'));'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_api_key_deleted_at" ON "api_key" (deleted_at) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "api_key" drop constraint if exists "api_key_type_check";'
    )

    this.addSql(
      'alter table if exists "api_key" alter column "type" type text using ("type"::text);'
    )
    this.addSql('drop index if exists "IDX_api_key_deleted_at";')
    this.addSql(
      'alter table if exists "api_key" drop column if exists "deleted_at";'
    )
  }
}
