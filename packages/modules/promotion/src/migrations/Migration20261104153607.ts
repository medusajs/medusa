import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261104153607 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "promotion_application_method" add column if not exists "min_quantity" integer null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "promotion_application_method" drop column if exists "min_quantity";`);
  }

}
