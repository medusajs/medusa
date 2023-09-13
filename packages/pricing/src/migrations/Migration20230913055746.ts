import { Migration } from '@mikro-orm/migrations';

export class Migration20230913055746 extends Migration {

  async up(): Promise<void> {
    // this.addSql('create table "currency" ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, constraint "currency_pkey" primary key ("code"));');

    // this.addSql('create table "money_amount" ("id" text not null, "currency_code" text null, "amount" numeric null, "min_quantity" numeric null, "max_quantity" numeric null, constraint "money_amount_pkey" primary key ("id"));');
    // this.addSql('create index "IDX_money_amount_currency_code" on "money_amount" ("currency_code");');

    // this.addSql('create table "price_set" ("id" text not null, constraint "price_set_pkey" primary key ("id"));');

    // this.addSql('create table "price_set_money_amount" ("id" text not null, "title" text not null, "price_set_id" text not null, "money_amount_id" text not null, constraint "price_set_money_amount_pkey" primary key ("id"));');

    // this.addSql('create table "rule_type" ("id" text not null, "name" text not null, "key_value" text not null, "default_priority" integer not null default 0, "kind" text check ("kind" in (\'priority\', \'filter\')) not null default \'filter\', "is_dynamic" boolean not null default false, constraint "rule_type_pkey" primary key ("id"));');

    this.addSql('create table "price_rule" ("id" text not null, "price_set_id" text not null, "rule_type_id" text not null, "is_dynamic" boolean not null default false, "value" text not null, "priority" integer not null default 0, "price_set_money_amount_id" text not null, "price_list_id" text not null, constraint "price_rule_pkey" primary key ("id"));');
    // this.addSql('alter table "price_rule" add constraint "price_rule_rule_type_id_unique" unique ("rule_type_id");');

    // this.addSql('alter table "money_amount" add constraint "money_amount_currency_code_foreign" foreign key ("currency_code") references "currency" ("code") on update cascade on delete set null;');

    // this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;');
    // this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade;');

    this.addSql('alter table "price_rule" add constraint "price_rule_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade;');
    this.addSql('alter table "price_rule" add constraint "price_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;');
    this.addSql('alter table "price_rule" add constraint "price_rule_price_set_money_amount_id_foreign" foreign key ("price_set_money_amount_id") references "price_set_money_amount" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    // this.addSql('alter table "money_amount" drop constraint "money_amount_currency_code_foreign";');

    // this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_money_amount_id_foreign";');

    // this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_set_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_price_set_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_price_set_money_amount_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_rule_type_id_foreign";');

    // this.addSql('drop table if exists "currency" cascade;');

    // this.addSql('drop table if exists "money_amount" cascade;');

    // this.addSql('drop table if exists "price_set" cascade;');

    // this.addSql('drop table if exists "price_set_money_amount" cascade;');

    // this.addSql('drop table if exists "rule_type" cascade;');

    this.addSql('drop table if exists "price_rule" cascade;');
  }

}
