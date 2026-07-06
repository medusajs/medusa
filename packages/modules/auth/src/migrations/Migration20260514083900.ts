import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260514083900 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "auth_mfa_factor" ("id" text not null, "auth_identity_id" text not null, "provider" text not null, "status" text not null, "provider_metadata" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auth_mfa_factor_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_mfa_factor_auth_identity_id" ON "auth_mfa_factor" ("auth_identity_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_mfa_factor_deleted_at" ON "auth_mfa_factor" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_auth_mfa_factor_auth_identity_provider_active" ON "auth_mfa_factor" ("auth_identity_id", "provider") WHERE deleted_at IS NULL AND status IN ('pending', 'enabled');`);

    this.addSql(`create table if not exists "auth_mfa_recovery_code" ("id" text not null, "auth_identity_id" text not null, "code_hash" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auth_mfa_recovery_code_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_mfa_recovery_code_auth_identity_id" ON "auth_mfa_recovery_code" ("auth_identity_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_mfa_recovery_code_deleted_at" ON "auth_mfa_recovery_code" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_auth_mfa_recovery_code_auth_identity_code_hash" ON "auth_mfa_recovery_code" ("auth_identity_id", "code_hash") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "auth_mfa_factor" add constraint "auth_mfa_factor_auth_identity_id_foreign" foreign key ("auth_identity_id") references "auth_identity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "auth_mfa_recovery_code" add constraint "auth_mfa_recovery_code_auth_identity_id_foreign" foreign key ("auth_identity_id") references "auth_identity" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "auth_mfa_factor" cascade;`);

    this.addSql(`drop table if exists "auth_mfa_recovery_code" cascade;`);
  }

}
