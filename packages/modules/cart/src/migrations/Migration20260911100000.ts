import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260911100000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "cart_line_item" add column if not exists "unit_weight" integer null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "cart_line_item" drop column if exists "unit_weight";`);
  }

}
