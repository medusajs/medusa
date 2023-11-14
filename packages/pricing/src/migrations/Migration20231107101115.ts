import { Migration } from "@mikro-orm/migrations"

export class Migration20231107101115 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "price_list" add column if not exists "title" text not null, add column if not exists "description" text not null, add column if not exists "type" text check ("type" in (\'sale\', \'override\')) not null default \'sale\';'
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "price_list" drop column if exists "title";')
    this.addSql('alter table "price_list" drop column if exists "description";')
    this.addSql('alter table "price_list" drop column if exists "type";')
  }
}
