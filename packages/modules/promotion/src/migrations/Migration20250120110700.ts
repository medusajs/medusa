import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250120110700 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "promotion_campaign_budget" drop constraint if exists "promotion_campaign_budget_campaign_id_unique";');
    this.addSql('drop index if exists "IDX_promotion_campaign_budget_campaign_id";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_campaign_id_unique" ON "promotion_campaign_budget" (campaign_id) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "promotion_application_method" drop constraint if exists "promotion_application_method_promotion_id_unique";');
    this.addSql('drop index if exists "IDX_promotion_application_method_promotion_id";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_promotion_application_method_promotion_id_unique" ON "promotion_application_method" (promotion_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_promotion_campaign_budget_campaign_id_unique";');
    this.addSql('alter table if exists "promotion_campaign_budget" add constraint "promotion_campaign_budget_campaign_id_unique" unique ("campaign_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_campaign_id" ON "promotion_campaign_budget" (campaign_id) WHERE deleted_at IS NULL;');

    this.addSql('drop index if exists "IDX_promotion_application_method_promotion_id_unique";');
    this.addSql('alter table if exists "promotion_application_method" add constraint "promotion_application_method_promotion_id_unique" unique ("promotion_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_promotion_application_method_promotion_id" ON "promotion_application_method" (promotion_id) WHERE deleted_at IS NULL;');
  }

}
