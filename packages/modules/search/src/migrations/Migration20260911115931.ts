import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260911115931 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "search_index_sync" add column if not exists "resumable" boolean not null default true;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "search_index_sync" drop column if exists "resumable";`);
  }

}
