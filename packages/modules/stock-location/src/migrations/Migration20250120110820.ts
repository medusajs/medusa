import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250120110820 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "stock_location" drop constraint if exists "stock_location_address_id_unique";');
    this.addSql('drop index if exists "IDX_stock_location_address_id";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_stock_location_address_id_unique" ON "stock_location" (address_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_stock_location_address_id_unique";');
    this.addSql('alter table if exists "stock_location" add constraint "stock_location_address_id_unique" unique ("address_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_stock_location_address_id" ON "stock_location" (address_id) WHERE deleted_at IS NULL;');
  }

}
