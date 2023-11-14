import { Migration } from "@mikro-orm/migrations"

export class Migration20231114100011 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "price_list" add column if not exists "title" text not null, add column if not exists "description" text not null, add column if not exists "type" text check ("type" in (\'sale\', \'override\')) not null default \'sale\', add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;'
    )

    this.addSql(
      'create index if not exists "IDX_price_list_deleted_at" on "price_list" ("deleted_at");'
    )

    this.addSql(
      'alter table "price_list_rule" drop constraint if exists "IDX_price_list_rule_rule_type_id_price_list_id_unique"'
    )

    this.addSql(
      'alter table "price_list_rule" add constraint "IDX_price_list_rule_rule_type_id_price_list_id_unique" unique ("price_list_id", "rule_type_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_price_list_deleted_at";')
    this.addSql('alter table "price_list" drop column if exists "title";')
    this.addSql('alter table "price_list" drop column if exists "description";')
    this.addSql('alter table "price_list" drop column if exists "type";')
    this.addSql('alter table "price_list" drop column if exists "created_at";')
    this.addSql('alter table "price_list" drop column if exists "updated_at";')
    this.addSql('alter table "price_list" drop column if exists "deleted_at";')

    this.addSql(
      'alter table "price_list_rule" drop constraint if exists "IDX_price_list_rule_rule_type_id_price_list_id_unique";'
    )
  }
}
