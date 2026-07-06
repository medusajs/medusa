import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250206141429 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_line_item_id_customer_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_line_item_id_customer_id" ON "loyalty_gift_card" (line_item_id, customer_id) WHERE deleted_at IS NULL;`
    );
  }
}
