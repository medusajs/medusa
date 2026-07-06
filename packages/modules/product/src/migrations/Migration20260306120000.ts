import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260306120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "product_tag" add column if not exists "external_id" text null;`
    )
    this.addSql(
      `alter table if exists "product_collection" add column if not exists "external_id" text null;`
    )
    this.addSql(
      `alter table if exists "product_type" add column if not exists "external_id" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "product_tag" drop column if exists "external_id";`
    )
    this.addSql(
      `alter table if exists "product_collection" drop column if exists "external_id";`
    )
    this.addSql(
      `alter table if exists "product_type" drop column if exists "external_id";`
    )
  }
}
