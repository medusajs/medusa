import { Migration } from "@mikro-orm/migrations"

export class Migration20240830094712 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table if exists \"notification\" add column if not exists \"status\" text check (\"status\" in ('pending', 'success', 'failure')) not null default 'pending';"
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "notification" drop column if exists "status";'
    )
  }
}
