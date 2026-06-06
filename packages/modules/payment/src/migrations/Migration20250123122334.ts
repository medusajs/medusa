import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250123122334 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "account_holder" ("id" text not null, "provider_id" text not null, "external_id" text not null, "email" text null, "data" jsonb not null default '{}', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "account_holder_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_account_holder_deleted_at" ON "account_holder" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_account_holder_provider_id_external_id_unique" ON "account_holder" (provider_id, external_id) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "payment_collection_payment_providers" drop constraint if exists "payment_collection_payment_providers_payment_coll_aa276_foreign";`);
    this.addSql(`alter table if exists "payment_collection_payment_providers" drop constraint if exists "payment_collection_payment_providers_payment_provider_id_foreign";`);

    this.addSql(`alter table if exists "payment_collection_payment_providers" add constraint "payment_collection_payment_providers_payment_col_aa276_foreign" foreign key ("payment_collection_id") references "payment_collection" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "payment_collection_payment_providers" add constraint "payment_collection_payment_providers_payment_pro_2d555_foreign" foreign key ("payment_provider_id") references "payment_provider" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "account_holder" cascade;`);

    this.addSql(`alter table if exists "payment_collection_payment_providers" drop constraint if exists "payment_collection_payment_providers_payment_col_aa276_foreign";`);
    this.addSql(`alter table if exists "payment_collection_payment_providers" drop constraint if exists "payment_collection_payment_providers_payment_pro_2d555_foreign";`);

    this.addSql(`alter table if exists "payment_collection_payment_providers" add constraint "payment_collection_payment_providers_payment_coll_aa276_foreign" foreign key ("payment_collection_id") references "payment_collection" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "payment_collection_payment_providers" add constraint "payment_collection_payment_providers_payment_provider_id_foreign" foreign key ("payment_provider_id") references "payment_provider" ("id") on update cascade on delete cascade;`);
  }

}
