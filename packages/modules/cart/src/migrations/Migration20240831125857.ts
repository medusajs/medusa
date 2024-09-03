import { Migration } from "@mikro-orm/migrations"

export class Migration20240831125857 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "cart" add column if not exists "completed_at" timestamptz null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "cart" drop column if exists "completed_at";'
    )
  }
}
