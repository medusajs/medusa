import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251008132218 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "product_variant" add column if not exists "thumbnail" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "product_variant" drop column if exists "thumbnail";`
    )
  }
}
