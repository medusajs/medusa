import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250411073236 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_image_product_id" ON "image" (product_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_image_product_id";`);
  }

}
