import { Migration } from "@mikro-orm/migrations"

export class Migration20230908084537 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product_category" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product_category" alter column "created_at" set default now();'
    )
    this.addSql(
      'alter table "product_category" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product_category" alter column "updated_at" set default now();'
    )

    this.addSql(
      'alter table "product_collection" add column IF NOT EXISTS "created_at" timestamptz not null default now(), add column IF NOT EXISTS "updated_at" timestamptz not null default now();'
    )

    this.addSql(
      'alter table "image" add column IF NOT EXISTS "created_at" timestamptz not null default now(), add column IF NOT EXISTS "updated_at" timestamptz not null default now();'
    )

    this.addSql(
      'alter table "product_tag" add column IF NOT EXISTS "created_at" timestamptz not null default now(), add column IF NOT EXISTS "updated_at" timestamptz not null default now();'
    )

    this.addSql(
      'alter table "product_type" add column IF NOT EXISTS "created_at" timestamptz not null default now(), add column IF NOT EXISTS "updated_at" timestamptz not null default now();'
    )

    this.addSql(
      'alter table "product" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product" alter column "created_at" set default now();'
    )
    this.addSql(
      'alter table "product" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product" alter column "updated_at" set default now();'
    )

    this.addSql(
      'alter table "product_option" add column IF NOT EXISTS "created_at" timestamptz not null default now(), add column IF NOT EXISTS "updated_at" timestamptz not null default now();'
    )

    this.addSql(
      'alter table "product_variant" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product_variant" alter column "created_at" set default now();'
    )
    this.addSql(
      'alter table "product_variant" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product_variant" alter column "updated_at" set default now();'
    )

    this.addSql(
      'alter table "product_option_value" add column IF NOT EXISTS "created_at" timestamptz not null default now(), add column  IF NOT EXISTS "updated_at" timestamptz not null default now();'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_category" alter column "created_at" drop default;'
    )
    this.addSql(
      'alter table "product_category" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product_category" alter column "updated_at" drop default;'
    )
    this.addSql(
      'alter table "product_category" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);'
    )

    this.addSql('alter table "product_collection" drop column "created_at";')
    this.addSql('alter table "product_collection" drop column "updated_at";')

    this.addSql('alter table "image" drop column "created_at";')
    this.addSql('alter table "image" drop column "updated_at";')

    this.addSql('alter table "product_tag" drop column "created_at";')
    this.addSql('alter table "product_tag" drop column "updated_at";')

    this.addSql('alter table "product_type" drop column "created_at";')
    this.addSql('alter table "product_type" drop column "updated_at";')

    this.addSql('alter table "product" alter column "created_at" drop default;')
    this.addSql(
      'alter table "product" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    )
    this.addSql('alter table "product" alter column "updated_at" drop default;')
    this.addSql(
      'alter table "product" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);'
    )

    this.addSql('alter table "product_option" drop column "created_at";')
    this.addSql('alter table "product_option" drop column "updated_at";')

    this.addSql(
      'alter table "product_variant" alter column "created_at" drop default;'
    )
    this.addSql(
      'alter table "product_variant" alter column "created_at" type timestamptz using ("created_at"::timestamptz);'
    )
    this.addSql(
      'alter table "product_variant" alter column "updated_at" drop default;'
    )
    this.addSql(
      'alter table "product_variant" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);'
    )

    this.addSql('alter table "product_option_value" drop column "created_at";')
    this.addSql('alter table "product_option_value" drop column "updated_at";')
  }
}
