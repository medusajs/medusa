import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260108122757 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "translation_settings" add column if not exists "is_active" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "translation_settings" drop column if exists "is_active";`);
  }

}
