import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260903130054 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "search_index_version" add column if not exists "build_seq" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "search_index_version" drop column if exists "build_seq";`);
  }

}
