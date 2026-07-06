import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250326095923 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "loyalty_gift_card" alter column "line_item_id" type text using ("line_item_id"::text);`);
    this.addSql(`alter table if exists "loyalty_gift_card" alter column "line_item_id" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "loyalty_gift_card" alter column "line_item_id" type text using ("line_item_id"::text);`);
    this.addSql(`alter table if exists "loyalty_gift_card" alter column "line_item_id" set not null;`);
  }

}
