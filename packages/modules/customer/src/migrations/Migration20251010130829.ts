import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251010130829 extends Migration {
  override async up(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "IDX_customer_group_name";')
  }

  override async down(): Promise<void> {
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_group_name" ON "customer_group" ("name") WHERE "deleted_at" IS NULL;'
    )
  }
}
