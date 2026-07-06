import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250206144714 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "loyalty_gift_card" add column if not exists "reference_id" text null, add column if not exists "reference" text null;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "loyalty_gift_card" drop column if exists "reference_id", drop column if exists "reference";`
    );
  }
}
