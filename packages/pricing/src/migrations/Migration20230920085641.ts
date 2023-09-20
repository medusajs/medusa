import { Migration } from '@mikro-orm/migrations';

export class Migration20230920085641 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "price_list" ("id" text not null, "name" text not null, "description" text not null, "type" text check ("type" in (\'sale\', \'override\')) not null default \'sale\', "status" text check ("status" in (\'active\', \'draft\')) not null default \'draft\', "starts_at" timestamptz null, "ends_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "price_list_pkey" primary key ("id"));');
    this.addSql('create index "IDX_price_list_status" on "price_list" ("status");');
    this.addSql('create index "IDX_product_deleted_at" on "price_list" ("deleted_at");');

    this.addSql('alter table "money_amount" add column "price_list_id" text null;');
    this.addSql('alter table "money_amount" add constraint "money_amount_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on delete cascade;');
    this.addSql('create index "IDX_money_amount_price_list_id" on "money_amount" ("price_list_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "money_amount" drop constraint "money_amount_price_list_id_foreign";');

    this.addSql('drop table if exists "price_list" cascade;');

    this.addSql('drop index "IDX_money_amount_price_list_id";');
    this.addSql('alter table "money_amount" drop column "price_list_id";');
  }

}
