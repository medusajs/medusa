import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20241212052837 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "tax_provider" add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_tax_provider_deleted_at" ON "tax_provider" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_tax_region_provider_id" ON "tax_region" (provider_id) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "tax_rate" alter column "rate" type real using ("rate"::real);');
    this.addSql('alter table if exists "tax_rate" alter column "rate" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_tax_provider_deleted_at";');
    this.addSql('alter table if exists "tax_provider" drop column if exists "created_at";');
    this.addSql('alter table if exists "tax_provider" drop column if exists "updated_at";');
    this.addSql('alter table if exists "tax_provider" drop column if exists "deleted_at";');

    this.addSql('drop index if exists "IDX_tax_region_provider_id";');

    this.addSql('alter table if exists "tax_rate" alter column "rate" type real using ("rate"::real);');
    this.addSql('alter table if exists "tax_rate" alter column "rate" set not null;');
  }

}
