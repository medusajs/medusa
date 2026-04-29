import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251011090511 extends Migration {
  // UP: Fixes the bug by dropping the bad index from product_collection.
  override async up(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "IDX_product_category_deleted_at";')
  }

  // DOWN: Reverts the fix by re-creating the original bug.
  override async down(): Promise<void> {
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_category_deleted_at" ON "product_collection" ("deleted_at");'
    )
  }
}
