import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251010131115 extends Migration {
  override async up(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "IDX_inventory_level_item_location";')
  }

  override async down(): Promise<void> {
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_level_item_location" ON "inventory_level" (inventory_item_id, location_id) WHERE deleted_at IS NULL;'
    )
  }
}
