import { Migration } from '@mikro-orm/migrations';

export class Migration20231107141520 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";');

    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "price_set_money_amount" drop constraint "price_set_money_amount_price_list_id_foreign";');

    this.addSql('alter table "price_set_money_amount" add constraint "price_set_money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete set null;');
  }

}
