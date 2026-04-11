import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251015123842 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_api_key_revoked_at" ON "api_key" (revoked_at) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_api_key_redacted" ON "api_key" (redacted) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_api_key_revoked_at";`)
    this.addSql(`drop index if exists "IDX_api_key_redacted";`)
  }
}
