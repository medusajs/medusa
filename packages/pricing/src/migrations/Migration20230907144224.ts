import { Migration } from "@mikro-orm/migrations"

export class Migration20230907144224 extends Migration {
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
      'create table "price_set_money_amount" ("id" text not null, "price_set_id" text null, "money_amount_id" text null, "title" text not null, constraint "price_set_money_amount_pkey" primary key ("id", "price_set_id", "money_amount_id"));'
    )

    this.addSql(
      'alter table "money_amount" add constraint "money_amount_currency_code_foreign" foreign key ("currency_code") references "currency" ("code") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade;'
    )
  }
}
