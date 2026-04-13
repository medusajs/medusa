import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250131205753 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_account_id" ON "store_credit_transaction_group" (code, account_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_account_id";');
  }

}
