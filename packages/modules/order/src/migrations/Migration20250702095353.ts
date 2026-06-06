import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250702095353 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "order_line_item_adjustment" add column if not exists "is_tax_inclusive" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "order_line_item_adjustment" drop column if exists "is_tax_inclusive";`);
  }

}
