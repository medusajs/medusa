import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20241206083313 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_store_currency_store_id" ON "store_currency" (store_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_store_currency_store_id";');
  }

}
