import { Migration } from "@mikro-orm/migrations"

export class Migration20240624153824 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "promotion_campaign" drop constraint if exists "IDX_campaign_identifier_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_promotion_campaign_campaign_identifier_unique" ON "promotion_campaign" (campaign_identifier) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'drop index if exists "IDX_promotion_campaign_campaign_identifier_unique";'
    )
    this.addSql(
      'alter table if exists "promotion_campaign" add constraint "IDX_campaign_identifier_unique" unique ("campaign_identifier");'
    )
  }
}
