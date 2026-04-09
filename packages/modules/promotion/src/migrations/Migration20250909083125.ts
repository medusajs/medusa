import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250909083125 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_campaign_budget_usage" drop constraint if exists "promotion_campaign_budget_usage_attribute_value_budget_id_unique";`
    )
    this.addSql(
      `create table if not exists "promotion_campaign_budget_usage" ("id" text not null, "attribute_value" text not null, "used" numeric not null default 0, "budget_id" text not null, "raw_used" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "promotion_campaign_budget_usage_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_usage_budget_id" ON "promotion_campaign_budget_usage" (budget_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_usage_deleted_at" ON "promotion_campaign_budget_usage" (deleted_at) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_usage_attribute_value_budget_id_unique" ON "promotion_campaign_budget_usage" (attribute_value, budget_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget_usage" add constraint "promotion_campaign_budget_usage_budget_id_foreign" foreign key ("budget_id") references "promotion_campaign_budget" ("id") on update cascade on delete cascade;`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget" drop constraint if exists "promotion_campaign_budget_type_check";`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget" add column if not exists "attribute" text null;`
    )
    this.addSql(
      `alter table if exists "promotion_campaign_budget" add constraint "promotion_campaign_budget_type_check" check("type" in ('spend', 'usage', 'use_by_attribute', 'spend_by_attribute'));`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop table if exists "promotion_campaign_budget_usage" cascade;`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget" drop constraint if exists "promotion_campaign_budget_type_check";`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget" drop column if exists "attribute";`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget" add constraint "promotion_campaign_budget_type_check" check("type" in ('spend', 'usage'));`
    )
  }
}
