import { Migration } from "@mikro-orm/migrations"

export class Migration20240703095850 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_user_email";')

    this.addSql(
      'CREATE UNIQUE INDEX "IDX_user_email" ON "user" (email) WHERE deleted_at IS NULL;'
    )
    // Adding this log here as the point of failure is not in this function, but bundled up when running all pending migration
    console.warn(
      `Note: If the index "IDX_user_email" fails to create, then delete any existing users with duplicate emails before retrying the migration.`
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user" (email) WHERE deleted_at IS NULL;'
    )
  }
}
