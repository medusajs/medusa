import { Migration } from "@mikro-orm/migrations"

export class Migration20240602110946 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "customer_group" ALTER COLUMN "name" SET NOT NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_group_name_unique" ON "customer_group" (name) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'ALTER TABLE IF EXISTS "customer_group" ALTER COLUMN "name" DROP NOT NULL;'
    )
    this.addSql('drop index if exists "IDX_customer_group_name_unique";')
  }
}
