import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251017155709 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_order_item_version";`)

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_order_item_order_id_version" ON "order_item" (order_id, version) WHERE deleted_at IS NULL;`
    )

    this.addSql(`drop index if exists "IDX_order_shipping_version";`)

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_order_shipping_order_id_version" ON "order_shipping" (order_id, version) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_order_item_order_id_version";`)

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_order_item_version" ON "order_item" (order_id, version) WHERE deleted_at IS NULL;`
    )

    this.addSql(`drop index if exists "IDX_order_shipping_order_id_version";`)

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_order_shipping_version" ON "order_shipping" (order_id, version) WHERE deleted_at IS NULL;`
    )
  }
}
