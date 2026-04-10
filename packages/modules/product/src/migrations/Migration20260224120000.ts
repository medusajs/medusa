import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260224120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "product_category" ADD COLUMN IF NOT EXISTS "external_id" text NULL;'
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "product_category" DROP COLUMN IF EXISTS "external_id";'
    )
  }
}
