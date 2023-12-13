import { Migration } from '@mikro-orm/migrations';

export class Migration20231212153311 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_money_amount_id_foreign";');
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_price_set_money_amount_id_foreign";');

    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade;');
    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on delete cascade;');

    this.addSql('alter table "price_rule" add constraint "price_rule_price_set_money_amount_id_foreign" foreign key ("price_set_money_amount_id") references "price_set_money_amount" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_money_amount_id_foreign";');
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";');

    this.addSql('alter table "price_rule" drop constraint "price_rule_price_set_money_amount_id_foreign";');

    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_money_amount_id_foreign" foreign key ("money_amount_id") references "money_amount" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "price_rule" add constraint "price_rule_price_set_money_amount_id_foreign" foreign key ("price_set_money_amount_id") references "price_set_money_amount" ("id") on update cascade on delete cascade;');
  }

}
