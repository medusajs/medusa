import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260615075225 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "payment_provider" add column if not exists "display_name" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "payment_provider" drop column if exists "display_name";`
    )
  }
}
