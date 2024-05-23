import { Migration } from "@mikro-orm/migrations"

export class Migration20240205025924 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "auth_identity" ("id" text not null, "entity_id" text not null, "provider" text not null, "scope" text not null, "user_metadata" jsonb null, "app_metadata" jsonb not null, "provider_metadata" jsonb null, constraint "auth_identity_pkey" primary key ("id"));'
    )
    this.addSql(
      'alter table "auth_identity" add constraint "IDX_auth_identity_provider_scope_entity_id" unique ("provider", "scope", "entity_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "auth_identity" cascade;')
  }
}
