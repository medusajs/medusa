import { Migration } from "@mikro-orm/migrations"

export class Migration20240624082354 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "currency" add column if not exists "deleted_at" timestamptz null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "currency" drop column if exists "deleted_at";'
    )
  }
}
