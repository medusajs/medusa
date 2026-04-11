import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20251219163509 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "rbac_role_policy" drop constraint if exists "rbac_role_policy_role_id_policy_id_unique";`);
    this.addSql(`alter table if exists "rbac_role_parent" drop constraint if exists "rbac_role_parent_role_id_parent_id_unique";`);
    this.addSql(`alter table if exists "rbac_role" drop constraint if exists "rbac_role_name_unique";`);
    this.addSql(`alter table if exists "rbac_policy" drop constraint if exists "rbac_policy_key_unique";`);
    this.addSql(`create table if not exists "rbac_policy" ("id" text not null, "key" text not null, "resource" text not null, "operation" text not null, "name" text null, "description" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_policy_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_policy_deleted_at" ON "rbac_policy" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_policy_key_unique" ON "rbac_policy" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_policy_resource" ON "rbac_policy" ("resource") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_policy_operation" ON "rbac_policy" ("operation") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rbac_role" ("id" text not null, "name" text not null, "description" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_deleted_at" ON "rbac_role" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_name_unique" ON "rbac_role" ("name") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rbac_role_parent" ("id" text not null, "role_id" text not null, "parent_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_parent_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_parent_role_id" ON "rbac_role_parent" ("role_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_parent_parent_id" ON "rbac_role_parent" ("parent_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_parent_deleted_at" ON "rbac_role_parent" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_parent_role_id_parent_id_unique" ON "rbac_role_parent" ("role_id", "parent_id") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rbac_role_policy" ("id" text not null, "role_id" text not null, "policy_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_policy_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_policy_role_id" ON "rbac_role_policy" ("role_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_policy_policy_id" ON "rbac_role_policy" ("policy_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_policy_deleted_at" ON "rbac_role_policy" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_policy_role_id_policy_id_unique" ON "rbac_role_policy" ("role_id", "policy_id") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade;`);
    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_parent_id_foreign" foreign key ("parent_id") references "rbac_role" ("id") on update cascade;`);

    this.addSql(`alter table if exists "rbac_role_policy" add constraint "rbac_role_policy_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade;`);
    this.addSql(`alter table if exists "rbac_role_policy" add constraint "rbac_role_policy_policy_id_foreign" foreign key ("policy_id") references "rbac_policy" ("id") on update cascade;`);
  }

}
