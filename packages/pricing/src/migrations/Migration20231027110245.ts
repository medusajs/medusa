import { Migration } from '@mikro-orm/migrations';

export class Migration20231027110245 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "price_list" ("id" text not null, "status" text check ("status" in (\'active\', \'draft\')) not null default \'draft\', "starts_at" timestamptz null, "ends_at" timestamptz null, "number_rules" integer not null default 0, constraint "price_list_pkey" primary key ("id"));');

    this.addSql('create table "price_list_rule" ("id" text not null, "rule_type_id" text not null, "value" text not null, "priority" integer not null default 0, "price_list_id" text not null, constraint "price_list_rule_pkey" primary key ("id"));');
    this.addSql('create index "IDX_price_rule_rule_type_id" on "price_list_rule" ("rule_type_id");');
    this.addSql('create index "IDX_price_rule_price_list_id" on "price_list_rule" ("price_list_id");');

    this.addSql('alter table "price_list_rule" add constraint "price_list_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;');
    this.addSql('alter table "price_list_rule" add constraint "price_list_rule_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade;');

    this.addSql('alter table "price_set_money_amount" add column "price_list_id" text null;');
    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete set null;');
    this.addSql('create index "IDX_price_rule_price_list_id" on "price_set_money_amount" ("price_list_id");');

    this.addSql('alter table "price_rule" drop column "price_list_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";');

    this.addSql('alter table "price_list_rule" drop constraint "price_list_rule_price_list_id_foreign";');

    this.addSql('drop table if exists "price_list" cascade;');

    this.addSql('drop table if exists "price_list_rule" cascade;');

    this.addSql('drop index "IDX_price_rule_price_list_id";');
    this.addSql('alter table "price_set_money_amount" drop column "price_list_id";');

    this.addSql('alter table "price_rule" add column "price_list_id" text not null;');
  }

}
