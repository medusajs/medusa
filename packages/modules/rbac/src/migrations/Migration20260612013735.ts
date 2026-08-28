import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260612013735 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "rbac_role_parent" drop constraint if exists "rbac_role_parent_role_id_foreign";`);
    this.addSql(`alter table if exists "rbac_role_parent" drop constraint if exists "rbac_role_parent_parent_id_foreign";`);

    this.addSql(`alter table if exists "rbac_role_policy" drop constraint if exists "rbac_role_policy_role_id_foreign";`);

    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_parent_id_foreign" foreign key ("parent_id") references "rbac_role" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "rbac_role_policy" add constraint "rbac_role_policy_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "rbac_role_parent" drop constraint if exists "rbac_role_parent_role_id_foreign";`);
    this.addSql(`alter table if exists "rbac_role_parent" drop constraint if exists "rbac_role_parent_parent_id_foreign";`);

    this.addSql(`alter table if exists "rbac_role_policy" drop constraint if exists "rbac_role_policy_role_id_foreign";`);

    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade;`);
    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_parent_id_foreign" foreign key ("parent_id") references "rbac_role" ("id") on update cascade;`);

    this.addSql(`alter table if exists "rbac_role_policy" add constraint "rbac_role_policy_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade;`);
  }

}
