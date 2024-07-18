import { Migration } from "@mikro-orm/migrations"

export class Migration20240715174100 extends Migration {
  async up(): Promise<void> {
    const sql = `
      DROP INDEX IF EXISTS "IDX_order_shipping_method_shipping_option_id";

      ALTER TABLE "order_shipping_method"
        ADD COLUMN if NOT exists "deleted_at" timestamptz NULL;

      CREATE INDEX IF NOT EXISTS "IDX_order_shipping_method_shipping_option_id" ON "order_shipping_method" (
          shipping_option_id
      ) WHERE deleted_at IS NULL;
    `

    this.addSql(sql)
  }
}
