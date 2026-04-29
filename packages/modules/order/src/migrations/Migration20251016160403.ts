import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251016160403 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order_line_item_adjustment" add column if not exists "version" integer not null default 1;`
    )

    this.addSql(`
      WITH latest_order_item_version AS (
        SELECT
          oli.id AS item_id,
          MAX(oi.version) AS version
        FROM "order_line_item" oli
        INNER JOIN "order_item" oi
          ON oi.item_id = oli.id
          AND oi.deleted_at IS NULL
        GROUP BY oli.id
      )
      UPDATE "order_line_item_adjustment" olia
      SET version = latest_order_item_version.version
      FROM latest_order_item_version
      WHERE olia.item_id = latest_order_item_version.item_id
        AND olia.version <> latest_order_item_version.version;
    `)
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "order_line_item_adjustment" drop column if exists "version";`
    )
  }
}
