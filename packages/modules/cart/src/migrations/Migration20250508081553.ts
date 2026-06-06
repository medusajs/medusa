import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250508081553 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cart_line_item_adjustment" add column if not exists "is_tax_inclusive" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "cart_line_item_adjustment" drop column if exists "is_tax_inclusive";`);
  }

}
