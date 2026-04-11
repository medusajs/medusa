import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251017153909 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_line_item_cart_id";`)

    this.addSql(`drop index if exists "IDX_adjustment_item_id";`)

    this.addSql(`drop index if exists "IDX_tax_line_item_id";`)

    this.addSql(`drop index if exists "IDX_shipping_method_cart_id";`)

    this.addSql(`drop index if exists "IDX_adjustment_shipping_method_id";`)

    this.addSql(`drop index if exists "IDX_tax_line_shipping_method_id";`)
  }

  override async down(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_line_item_cart_id" ON "cart_line_item" (cart_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_adjustment_item_id" ON "cart_line_item_adjustment" (item_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_line_item_id" ON "cart_line_item_tax_line" (item_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_shipping_method_cart_id" ON "cart_shipping_method" (cart_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_adjustment_shipping_method_id" ON "cart_shipping_method_adjustment" (shipping_method_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_line_shipping_method_id" ON "cart_shipping_method_tax_line" (shipping_method_id) WHERE deleted_at IS NULL;`
    )
  }
}
