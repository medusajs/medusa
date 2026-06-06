import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250516081326 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_variant_id_product_id" ON "product_variant" (id, product_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_product_variant_id_product_id";`);
  }

}
