import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261012220933 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "store" add column if not exists "logo_url" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "store" drop column if exists "logo_url";`);
  }

}
