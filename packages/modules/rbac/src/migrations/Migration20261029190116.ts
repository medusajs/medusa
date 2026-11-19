import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261029190116 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "rbac_role_parent" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "rbac_role_parent" ("id" text not null, "role_id" text not null, "parent_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_parent_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_parent_role_id" ON "rbac_role_parent" ("role_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_parent_parent_id" ON "rbac_role_parent" ("parent_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_parent_deleted_at" ON "rbac_role_parent" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_parent_role_id_parent_id_unique" ON "rbac_role_parent" ("role_id", "parent_id") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "rbac_role_parent" add constraint "rbac_role_parent_parent_id_foreign" foreign key ("parent_id") references "rbac_role" ("id") on update cascade on delete cascade;`);
  }

}
