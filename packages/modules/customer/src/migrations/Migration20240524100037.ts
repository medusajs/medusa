import { Migration } from "@mikro-orm/migrations"

export class Migration20240524100037 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_email_unique" ON "customer" (email) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_customer_email_unique";')
  }
}
