import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260805211006 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "rbac_policy" add column if not exists "is_registered" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "rbac_policy" drop column if exists "is_registered";`);
  }

}
