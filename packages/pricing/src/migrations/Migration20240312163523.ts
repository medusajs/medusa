import { Migration } from "@mikro-orm/migrations"

export class Migration20240312163523 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "rule_type" add column if not exists "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now();'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "rule_type" drop column if exists "created_at";'
    )
    this.addSql(
      'alter table if exists "rule_type" drop column if exists "updated_at";'
    )
  }
}
