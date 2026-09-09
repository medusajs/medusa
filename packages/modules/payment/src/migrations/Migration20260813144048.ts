import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260813144048 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "payment" add column if not exists "pending_captures" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "payment" drop column if exists "pending_captures";`
    )
  }
}
