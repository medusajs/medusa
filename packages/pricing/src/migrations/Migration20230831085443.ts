import { Migration } from '@mikro-orm/migrations';

export class Migration20230831085443 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "currency" ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, constraint "currency_pkey" primary key ("code"));');

    this.addSql('create table "price_list" ("id" text not null, "name" text not null, "description" text not null, "type" text check ("type" in (\'sale\', \'override\')) not null default \'sale\', "status" text check ("status" in (\'active\', \'draft\')) not null default \'draft\', "starts_at" timestamptz null, "ends_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_list_pkey" primary key ("id"));');
    this.addSql('create index "IDX_product_deleted_at" on "price_list" ("deleted_at");');

    this.addSql('create table "money_amount" ("id" text not null, "currency_code" text null, "amount" numeric null, "min_quantity" numeric null, "max_quantity" numeric null, "price_list_id" text null, constraint "money_amount_pkey" primary key ("id"));');
    this.addSql('create index "IDX_money_amount_currency_code" on "money_amount" ("currency_code");');
    this.addSql('create index "IDX_money_amount_price_list_id" on "money_amount" ("price_list_id");');

    this.addSql('alter table "money_amount" add constraint "money_amount_currency_code_foreign" foreign key ("currency_code") references "currency" ("code") on update cascade on delete set null;');
    this.addSql('alter table "money_amount" add constraint "money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "money_amount" drop constraint "money_amount_currency_code_foreign";');

    this.addSql('alter table "money_amount" drop constraint "money_amount_price_list_id_foreign";');

    this.addSql('drop table if exists "currency" cascade;');

    this.addSql('drop table if exists "price_list" cascade;');

    this.addSql('drop table if exists "money_amount" cascade;');
  }

}
