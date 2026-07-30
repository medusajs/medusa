import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260729201429 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "rbac_role_assignment" drop constraint if exists "rbac_role_assignment_role_id_scope_scope_id_reference_reference_id_unique";`);
    this.addSql(`create table if not exists "rbac_role_assignment" ("id" text not null, "role_id" text not null, "reference" text not null, "reference_id" text not null, "scope" text null, "scope_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rbac_role_assignment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_role_id" ON "rbac_role_assignment" ("role_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_deleted_at" ON "rbac_role_assignment" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_role_id_scope_scope_id" ON "rbac_role_assignment" ("role_id", "scope", "scope_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_scope_scope_id_reference_reference_id" ON "rbac_role_assignment" ("scope", "scope_id", "reference", "reference_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_reference_reference_id" ON "rbac_role_assignment" ("reference", "reference_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_rbac_role_assignment_role_id_scope_scope_id_reference_reference_id_unique" ON "rbac_role_assignment" ("role_id", "scope", "scope_id", "reference", "reference_id") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "rbac_role_assignment" add constraint "rbac_role_assignment_role_id_foreign" foreign key ("role_id") references "rbac_role" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "rbac_role_assignment" cascade;`);
  }

}
