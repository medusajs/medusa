import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260726120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "fulfillment_item" add column if not exists "required_quantity" numeric null, add column if not exists "raw_required_quantity" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "fulfillment_item" drop column if exists "required_quantity", drop column if exists "raw_required_quantity";`
    )
  }
}
