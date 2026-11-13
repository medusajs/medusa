import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261112153024 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "audit_log" drop constraint if exists "audit_log_actor_type_check";`);

    this.addSql(`alter table if exists "audit_log" alter column "actor_type" type text using ("actor_type"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "audit_log" add constraint "audit_log_actor_type_check" check("actor_type" in ('user', 'api_key', 'customer', 'system', 'anonymous'));`);
  }

}
