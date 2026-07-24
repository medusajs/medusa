import { Migration } from "@mikro-orm/migrations"

export class Migration20260623180000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_option_global_title_unique"
      ON "product_option" (title)
      WHERE deleted_at IS NULL AND is_exclusive = false;
    `)
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_product_option_global_title_unique";`
    )
  }
}
