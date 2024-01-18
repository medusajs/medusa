import { Migration } from '@mikro-orm/migrations';

export class Migration20240104154451 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_provider" ("provider" text not null, "name" text not null, "domain" text check ("domain" in (\'all\', \'store\', \'admin\')) not null default \'all\', "is_active" boolean not null default false, constraint "auth_provider_pkey" primary key ("provider"));');

    this.addSql('create table "auth_user" ("id" text not null, "provider_id" text null, "user_metadata" jsonb null, "app_metadata" jsonb null, "provider_metadata" jsonb null, constraint "auth_user_pkey" primary key ("id"));');

    this.addSql('alter table "auth_user" add constraint "auth_user_provider_id_foreign" foreign key ("provider_id") references "auth_provider" ("provider") on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "auth_user" drop constraint "auth_user_provider_id_foreign";');

    this.addSql('drop table if exists "auth_provider" cascade;');

    this.addSql('drop table if exists "auth_user" cascade;');
  }

}
