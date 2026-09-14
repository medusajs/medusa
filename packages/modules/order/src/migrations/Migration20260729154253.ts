import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260729154253 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order_change" add column if not exists "no_notification" boolean null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "order_change" drop column if exists "no_notification";`
    )
  }
}
