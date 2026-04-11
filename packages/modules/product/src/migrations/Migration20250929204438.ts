import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250929204438 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "product_variant_product_image" (
        "id" text not null, 
        "variant_id" text not null, 
        "image_id" text not null, 
        "created_at" timestamptz not null default now(), 
        "updated_at" timestamptz not null default now(), 
        "deleted_at" timestamptz null, 
        constraint "product_variant_product_image_pkey" primary key ("id"),
        constraint "product_variant_product_image_image_id_foreign" 
          foreign key ("image_id") references "image" ("id") on delete cascade
      );`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_variant_product_image_variant_id" ON "product_variant_product_image" (variant_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_variant_product_image_image_id" ON "product_variant_product_image" (image_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_variant_product_image_deleted_at" ON "product_variant_product_image" (deleted_at) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_variant_product_image" cascade;`)
  }
}
