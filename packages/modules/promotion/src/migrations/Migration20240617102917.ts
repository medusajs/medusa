import { Migration } from "@mikro-orm/migrations"

export class Migration20240617102917 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "promotion_application_method" alter column "currency_code" type text using ("currency_code"::text);'
    )

    this.addSql(
      'alter table "promotion_application_method" alter column "currency_code" drop not null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "promotion_application_method" alter column "currency_code" type text using ("currency_code"::text);'
    )
    this.addSql(
      'alter table "promotion_application_method" alter column "currency_code" set not null;'
    )
  }
}
