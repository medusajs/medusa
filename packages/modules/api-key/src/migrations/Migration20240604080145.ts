import { Migration } from '@mikro-orm/migrations';

export class Migration20240604080145 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "api_key" add column if not exists "updated_at" timestamptz not null default now();');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "api_key" drop column if exists "updated_at";');
  }

}
