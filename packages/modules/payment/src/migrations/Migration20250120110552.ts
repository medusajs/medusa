import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250120110552 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "payment" drop constraint if exists "payment_payment_session_id_unique";'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_payment_payment_session_id_unique" ON "payment" (payment_session_id) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_payment_payment_session_id_unique";')
    this.addSql(
      'alter table if exists "payment" add constraint "payment_payment_session_id_unique" unique ("payment_session_id");'
    )
  }
}
