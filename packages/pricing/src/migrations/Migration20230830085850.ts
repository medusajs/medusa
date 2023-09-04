import { Migration } from '@mikro-orm/migrations';

export class Migration20230830085850 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "currency" ("code" text not null, "symbol" text not null, "symbol_native" text not null, "name" text not null, constraint "currency_pkey" primary key ("code"));');

    this.addSql('create table "money_amount" ("id" text not null, "currency_code" text null, "amount" numeric null, "min_quantity" numeric null, "max_quantity" numeric null, constraint "money_amount_pkey" primary key ("id"));');
    this.addSql('create index "IDX_money_amount_currency_code" on "money_amount" ("currency_code");');

    this.addSql('alter table "money_amount" add constraint "money_amount_currency_code_foreign" foreign key ("currency_code") references "currency" ("code") on update cascade on delete set null;');
  }

}
