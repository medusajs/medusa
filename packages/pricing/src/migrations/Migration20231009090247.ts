import { Migration } from "@mikro-orm/migrations"

export class Migration20231009090247 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "currency" add column "includes_tax" boolean null;'
    )

    this.addSql(
      'alter table "money_amount" add column "price_list_id" text null, add column "region_id" text null;'
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "currency" drop column "includes_tax";')

    this.addSql('alter table "money_amount" drop column "price_list_id";')
    this.addSql('alter table "money_amount" drop column "region_id";')
  }
}
