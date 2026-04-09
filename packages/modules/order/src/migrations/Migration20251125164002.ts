import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251125164002 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order_change" add column if not exists "carry_over_promotions" boolean null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "order_change" drop column if exists "carry_over_promotions";`
    )
  }
}
