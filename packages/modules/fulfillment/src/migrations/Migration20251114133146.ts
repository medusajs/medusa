import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251114133146 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_option_type_id" ON "shipping_option" ("shipping_option_type_id") WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_shipping_option_shipping_option_type_id";`
    )
  }
}
