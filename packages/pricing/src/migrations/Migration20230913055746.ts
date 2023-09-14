import { Migration } from '@mikro-orm/migrations';

export class Migration20230913055746 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "price_rule" ("id" text not null, "price_set_id" text not null, "rule_type_id" text not null, "is_dynamic" boolean not null default false, "value" text not null, "priority" integer not null default 0, "price_set_money_amount_id" text not null, "price_list_id" text not null, constraint "price_rule_pkey" primary key ("id"));');

    this.addSql('alter table "price_rule" add constraint "price_rule_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade;');
    this.addSql('alter table "price_rule" add constraint "price_rule_rule_type_id_foreign" foreign key ("rule_type_id") references "rule_type" ("id") on update cascade;');
    this.addSql('alter table "price_rule" add constraint "price_rule_price_set_money_amount_id_foreign" foreign key ("price_set_money_amount_id") references "price_set_money_amount" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "price_rule" drop constraint "price_rule_price_set_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_price_set_money_amount_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_rule_type_id_foreign";');

    this.addSql('drop table if exists "price_rule" cascade;');
  }g

}
