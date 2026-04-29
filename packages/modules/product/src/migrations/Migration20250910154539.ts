import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250910154539 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_image_product_id" ON "image" (product_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_image_deleted_at" ON "image" (deleted_at) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_image_url" ON "image" (url) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_image_rank" ON "image" (rank) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_image_url_rank_product_id" ON "image" (url, rank, product_id) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_image_rank_product_id" ON "image" (rank, product_id) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_image_product_id";`)
    this.addSql(`drop index if exists "IDX_image_deleted_at";`)
    this.addSql(`drop index if exists "IDX_product_image_url";`)
    this.addSql(`drop index if exists "IDX_product_image_rank";`)
    this.addSql(`drop index if exists "IDX_product_image_url_rank_product_id";`)
    this.addSql(`drop index if exists "IDX_product_image_rank_product_id";`)
  }
}
