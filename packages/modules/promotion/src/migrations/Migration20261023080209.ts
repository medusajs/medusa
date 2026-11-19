import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20261023080209 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_campaign_budget" alter column "raw_used" type jsonb using ("raw_used"::jsonb);`
    )
    this.addSql(
      `alter table if exists "promotion_campaign_budget" alter column "raw_used" set default '{"value":"0","precision":20}';`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget_usage" alter column "raw_used" type jsonb using ("raw_used"::jsonb);`
    )
    this.addSql(
      `alter table if exists "promotion_campaign_budget_usage" alter column "raw_used" set default '{"value":"0","precision":20}';`
    )

    this.addSql(
      `alter table if exists "promotion_application_method" add column if not exists "target_selection_strategy" text check ("target_selection_strategy" in ('most_expensive_first', 'cheapest_first')) not null default 'most_expensive_first';`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_campaign_budget" alter column "raw_used" drop default;`
    )
    this.addSql(
      `alter table if exists "promotion_campaign_budget" alter column "raw_used" type jsonb using ("raw_used"::jsonb);`
    )

    this.addSql(
      `alter table if exists "promotion_campaign_budget_usage" alter column "raw_used" drop default;`
    )
    this.addSql(
      `alter table if exists "promotion_campaign_budget_usage" alter column "raw_used" type jsonb using ("raw_used"::jsonb);`
    )

    this.addSql(
      `alter table if exists "promotion_application_method" drop column if exists "target_selection_strategy";`
    )
  }
}
