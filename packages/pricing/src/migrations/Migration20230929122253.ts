import { Migration } from "@mikro-orm/migrations"

export class Migration20230929122253 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "currency" ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, constraint "currency_pkey" primary key ("code"));'
    )

    this.addSql(
      'create table if not exists "money_amount" ("id" text not null, "currency_code" text null, "amount" numeric null, "min_quantity" numeric null, "max_quantity" numeric null, constraint "money_amount_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index if not exists "IDX_money_amount_currency_code" on "money_amount" ("currency_code");'
    )

    this.addSql(
      'create table "price_set" ("id" text not null, constraint "price_set_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_set_money_amount" ("id" text not null, "title" text not null, "price_set_id" text not null, "money_amount_id" text not null, "rules_count" integer not null default 0, constraint "price_set_money_amount_pkey" primary key ("id"));'
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
      'create table "price_set_rule_type" ("id" text not null, "price_set_id" text not null, "rule_type_id" text not null, constraint "price_set_rule_type_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_price_set_rule_type_price_set_id" on "price_set_rule_type" ("price_set_id");'
    )
    this.addSql(
      'create index "IDX_price_set_rule_type_rule_type_id" on "price_set_rule_type" ("rule_type_id");'
    )

    this.addSql(
      'create table "price_set_money_amount_rules" ("id" text not null, "price_set_money_amount_id" text not null, "rule_type_id" text not null, "value" text not null, constraint "price_set_money_amount_rules_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_price_set_money_amount_rules_price_set_money_amount_id" on "price_set_money_amount_rules" ("price_set_money_amount_id");'
    )
    this.addSql(
      'create index "IDX_price_set_money_amount_rules_rule_type_id" on "price_set_money_amount_rules" ("rule_type_id");'
    )

    this.addSql(
      'create table "price_rule" ("id" text not null, "price_set_id" text not null, "rule_type_id" text not null, "is_dynamic" boolean not null default false, "value" text not null, "priority" integer not null default 0, "price_set_money_amount_id" text not null, "price_list_id" text not null, constraint "price_rule_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_price_rule_price_set_id" on "price_rule" ("price_set_id");'
    )
    this.addSql(
      'create index "IDX_price_rule_rule_type_id" on "price_rule" ("rule_type_id");'
    )
    this.addSql(
      'create index "IDX_price_rule_price_set_money_amount_id" on "price_rule" ("price_set_money_amount_id");'
    )

    this.addSql(
      'alter table "money_amount" add constraint "money_amount_currency_code_foreign" foreign key ("currency_code") references "currency" ("code") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "price_set_rule_type" add constraint "price_set_rule_type_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_set_rule_type" add constraint "price_set_rule_type_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "price_set_money_amount_rules" add constraint "price_set_money_amount_rules_price_set_money_amount_id_foreign" foreign key ("price_set_money_amount_id") references "price_set_money_amount" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_set_money_amount_rules" add constraint "price_set_money_amount_rules_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "price_rule" add constraint "price_rule_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "price_rule" add constraint "price_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "price_rule" add constraint "price_rule_price_set_money_amount_id_foreign" foreign key ("price_set_money_amount_id") references "price_set_money_amount" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'create table if not exists "price_list" ("id" text not null, "status" text check ("status" in (\'active\', \'draft\')) not null default \'draft\', "starts_at" timestamptz null, "ends_at" timestamptz null, "rules_count" integer not null default 0, constraint "price_list_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "price_list_rule" ("id" text not null, "rule_type_id" text not null, "price_list_id" text not null, constraint "price_list_rule_pkey" primary key ("id"));'
    )

    this.addSql(
      'create index "IDX_price_list_rule_rule_type_id" on "price_list_rule" ("rule_type_id");'
    )
    this.addSql(
      'create index "IDX_price_list_rule_price_list_id" on "price_list_rule" ("price_list_id");'
    )

    this.addSql(
      'alter table "price_list_rule" add constraint "price_list_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "price_list_rule" add constraint "price_list_rule_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "price_set_money_amount" add column "price_list_id" text null;'
    )
    this.addSql(
      'alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'create index "IDX_price_rule_price_list_id" on "price_set_money_amount" ("price_list_id");'
    )

    this.addSql('alter table "price_rule" drop column "price_list_id";')
  }
}
