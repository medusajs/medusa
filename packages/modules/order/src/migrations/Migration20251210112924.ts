import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251210112924 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_unique_order_item_version_item_id";`)
  }

  override async down(): Promise<void> {}
}
