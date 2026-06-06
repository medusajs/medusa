import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241202100304 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "auth_identity" add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_auth_identity_deleted_at" ON "auth_identity" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "provider_identity" add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_provider_identity_deleted_at" ON "provider_identity" (deleted_at) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_auth_identity_deleted_at";')
    this.addSql(
      'alter table if exists "auth_identity" drop column if exists "deleted_at";'
    )

    this.addSql('drop index if exists "IDX_provider_identity_deleted_at";')
    this.addSql(
      'alter table if exists "provider_identity" drop column if exists "deleted_at";'
    )
  }
}
