import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260719090000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_application_method" add column if not exists "max_amount" numeric null;`
    )
    this.addSql(
      `alter table if exists "promotion_application_method" add column if not exists "raw_max_amount" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_application_method" drop column if exists "max_amount";`
    )
    this.addSql(
      `alter table if exists "promotion_application_method" drop column if exists "raw_max_amount";`
    )
  }
}
