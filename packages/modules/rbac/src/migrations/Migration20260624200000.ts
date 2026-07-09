import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260624200000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "rbac_role_inheritance" drop constraint if exists "rbac_role_inheritance_role_id_inherited_role_id_unique";`);

    this.addSql(`create table if not exists "rbac_role_inheritance" ("id" text not null, "role_id" text not null, "inherited_role_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_inheritance_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_inheritance_role_id" ON "rbac_role_inheritance" ("role_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_inheritance_inherited_role_id" ON "rbac_role_inheritance" ("inherited_role_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_inheritance_deleted_at" ON "rbac_role_inheritance" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_inheritance_role_id_inherited_role_id_unique" ON "rbac_role_inheritance" ("role_id", "inherited_role_id") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "rbac_role_inheritance" add constraint "rbac_role_inheritance_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade;`);
    this.addSql(`alter table if exists "rbac_role_inheritance" add constraint "rbac_role_inheritance_inherited_role_id_foreign" foreign key ("inherited_role_id") references "rbac_role" ("id") on update cascade;`);
  }

}
