import { Migration } from "@mikro-orm/migrations"

export class Migration20240513085637 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "promotion" drop constraint if exists "promotion_campaign_id_foreign";'
    )

    this.addSql(
      'alter table if exists "promotion" add constraint "promotion_campaign_id_foreign" foreign key ("campaign_id") references "promotion_campaign" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table if exists "promotion_application_method" add column if not exists "currency_code" text not null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_application_method_currency_code" ON "promotion_application_method" (currency_code) WHERE deleted_at IS NOT NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "promotion" drop constraint if exists "promotion_campaign_id_foreign";'
    )

    this.addSql(
      'alter table if exists "promotion" add constraint "promotion_campaign_id_foreign" foreign key ("campaign_id") references "promotion_campaign" ("id") on delete set null;'
    )

    this.addSql(
      'drop index if exists "IDX_promotion_application_method_currency_code";'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" drop column if exists "currency_code";'
    )
  }
}
