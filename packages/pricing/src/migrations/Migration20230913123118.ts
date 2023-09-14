import { Migration } from "@mikro-orm/migrations"

export class Migration20230913123118 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "currency" ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, constraint "currency_pkey" primary key ("code"));'
    )

    this.addSql(
      'create table "money_amount" ("id" text not null, "currency_code" text null, "amount" numeric null, "min_quantity" numeric null, "max_quantity" numeric null, constraint "money_amount_pkey" primary key ("id"));'
    )

    this.addSql(
      'create index "IDX_money_amount_currency_code" on "money_amount" ("currency_code");'
    )

    this.addSql(
      'create table "price_set" ("id" text not null, constraint "price_set_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_set_money_amount" ("id" text not null, "title" text not null, "price_set_id" text not null, "money_amount_id" text not null, constraint "price_set_money_amount_pkey" primary key ("id"));'
    )

    this.addSql(
      'create index "IDX_price_set_money_amount_price_set_id" on "price_set_money_amount" ("price_set_id");'
    )

    this.addSql(
      'create index "IDX_price_set_money_amount_money_amount_id" on "price_set_money_amount" ("money_amount_id");'
    )

    this.addSql(
      'create table "rule_type" ("id" text not null, "name" text not null, "rule_attribute" text not null, "default_priority" integer not null default 0, constraint "rule_type_pkey" primary key ("id"));'
    )

    this.addSql(
      'create index "IDX_rule_type_rule_attribute" on "rule_type" ("rule_attribute");'
    )

    this.addSql(
      'alter table "money_amount" add constraint "money_amount_currency_code_foreign" foreign key ("currency_code") references "currency" ("code") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade;'
    )
  }
}
