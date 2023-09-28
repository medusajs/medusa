import { Migration } from "@mikro-orm/migrations"

export class Migration20230928135653 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "price_rule" drop constraint "price_rule_price_set_id_foreign";'
    )

    this.addSql(
      'alter table "price_set_money_amount" add column "number_rules" integer not null default 0;'
    )

    this.addSql(
      'alter table "price_rule" drop constraint "price_rule_rule_type_id_unique";'
    )
    this.addSql(
      'alter table "price_rule" add constraint "price_rule_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "price_rule" drop constraint "price_rule_price_set_id_foreign";'
    )

    this.addSql(
      'alter table "price_set_money_amount" drop column "number_rules";'
    )

    this.addSql(
      'alter table "price_rule" add constraint "price_rule_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "price_rule" add constraint "price_rule_rule_type_id_unique" unique ("rule_type_id");'
    )
  }
}
