import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260106185528 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order_shipping_method_adjustment" add column if not exists "version" integer not null default 1;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_order_shipping_method_adjustment_version_shipping_method" ON "order_shipping_method_adjustment" ("version", "shipping_method_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(`WITH latest_order_shipping_version AS (
          SELECT
            os.shipping_method_id AS shipping_method_id,
            MAX(os.version) AS version
          FROM "order_shipping" os
          WHERE os.deleted_at IS NULL
          GROUP BY os.shipping_method_id
        )
        UPDATE "order_shipping_method_adjustment" osma
        SET version = losv.version
        FROM latest_order_shipping_version losv
        WHERE osma.shipping_method_id = losv.shipping_method_id
          AND osma.version <> losv.version
        `)
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_order_shipping_method_adjustment_version_shipping_method";`
    )
    this.addSql(
      `alter table if exists "order_shipping_method_adjustment" drop column if exists "version";`
    )
  }
}
