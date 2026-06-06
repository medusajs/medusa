import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241211061114 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "promotion_campaign_budget" drop constraint if exists "promotion_campaign_budget_campaign_id_foreign";'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_deleted_at" ON "promotion_campaign" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "promotion_campaign_budget" add constraint "promotion_campaign_budget_campaign_id_foreign" foreign key ("campaign_id") references "promotion_campaign" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_campaign_id" ON "promotion_campaign_budget" (campaign_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_deleted_at" ON "promotion_campaign_budget" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_id" ON "promotion" (campaign_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_deleted_at" ON "promotion" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "promotion_application_method" alter column "value" type numeric using ("value"::numeric);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "value" drop not null;'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "raw_value" type jsonb using ("raw_value"::jsonb);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "raw_value" drop not null;'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "max_quantity" type integer using ("max_quantity"::integer);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "apply_to_quantity" type integer using ("apply_to_quantity"::integer);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "buy_rules_min_quantity" type integer using ("buy_rules_min_quantity"::integer);'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_application_method_promotion_id" ON "promotion_application_method" (promotion_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_application_method_deleted_at" ON "promotion_application_method" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_deleted_at" ON "promotion_rule" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'drop index if exists "IDX_promotion_rule_promotion_rule_value_id";'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_value_promotion_rule_id" ON "promotion_rule_value" (promotion_rule_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_value_deleted_at" ON "promotion_rule_value" (deleted_at) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "promotion_campaign_budget" drop constraint if exists "promotion_campaign_budget_campaign_id_foreign";'
    )

    this.addSql('drop index if exists "IDX_promotion_campaign_deleted_at";')

    this.addSql(
      'drop index if exists "IDX_promotion_campaign_budget_campaign_id";'
    )
    this.addSql(
      'drop index if exists "IDX_promotion_campaign_budget_deleted_at";'
    )
    this.addSql(
      'alter table if exists "promotion_campaign_budget" add constraint "promotion_campaign_budget_campaign_id_foreign" foreign key ("campaign_id") references "promotion_campaign" ("id") on update cascade;'
    )

    this.addSql('drop index if exists "IDX_promotion_campaign_id";')
    this.addSql('drop index if exists "IDX_promotion_deleted_at";')

    this.addSql(
      'alter table if exists "promotion_application_method" alter column "value" type numeric using ("value"::numeric);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "value" set not null;'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "max_quantity" type numeric using ("max_quantity"::numeric);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "apply_to_quantity" type numeric using ("apply_to_quantity"::numeric);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "buy_rules_min_quantity" type numeric using ("buy_rules_min_quantity"::numeric);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "raw_value" type jsonb using ("raw_value"::jsonb);'
    )
    this.addSql(
      'alter table if exists "promotion_application_method" alter column "raw_value" set not null;'
    )
    this.addSql(
      'drop index if exists "IDX_promotion_application_method_promotion_id";'
    )
    this.addSql(
      'drop index if exists "IDX_promotion_application_method_deleted_at";'
    )

    this.addSql('drop index if exists "IDX_promotion_rule_deleted_at";')

    this.addSql(
      'drop index if exists "IDX_promotion_rule_value_promotion_rule_id";'
    )
    this.addSql('drop index if exists "IDX_promotion_rule_value_deleted_at";')
    this.addSql(
      'create index if not exists "IDX_promotion_rule_promotion_rule_value_id" on "promotion_rule_value" ("promotion_rule_id");'
    )
  }
}
