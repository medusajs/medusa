import { Migration } from "@mikro-orm/migrations"

export class Migration20231101232834 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "price_list_rule_value" ("id" text not null, "price_list_rule_id" text not null, "value" text not null, constraint "price_list_rule_value_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_price_list_rule_price_list_rule_value_id" on "price_list_rule_value" ("price_list_rule_id");'
    )

    this.addSql(
      'alter table "price_list_rule_value" add constraint "price_list_rule_value_price_list_rule_id_foreign" foreign key ("price_list_rule_id") references "price_list_rule" ("id") on update cascade on delete cascade;'
    )

    this.addSql('alter table "price_list_rule" drop column "value";')

    this.addSql(
      `ALTER TABLE price_list ADD COLUMN IF NOT EXISTS number_rules integer not null default 0`
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "price_list_rule_value" cascade;')

    this.addSql(
      'alter table "price_list_rule" add column "value" text[] not null;'
    )

    this.addSql(`ALTER TABLE price_list DROP COLUMN IF EXISTS number_rules`)
  }
}
