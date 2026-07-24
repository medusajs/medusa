import { Migration } from "@mikro-orm/migrations"

export class Migration20251110180907 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "product_product_option_value" ("id" text not null, "product_product_option_id" text not null, "product_option_value_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_product_option_value_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_product_option_value_product_product_option_id" ON "product_product_option_value" ("product_product_option_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_product_option_value_product_option_value_id" ON "product_product_option_value" ("product_option_value_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_product_option_value_deleted_at" ON "product_product_option_value" ("deleted_at") WHERE deleted_at IS NULL;`
    )

    this.addSql(
      `alter table if exists "product_product_option_value" add constraint "product_product_option_value_product_product_option_id_foreign" foreign key ("product_product_option_id") references "product_product_option" ("id") on update cascade on delete cascade;`
    )
    this.addSql(
      `alter table if exists "product_product_option_value" add constraint "product_product_option_value_product_option_value_id_foreign" foreign key ("product_option_value_id") references "product_option_value" ("id") on update cascade on delete cascade;`
    )

    this.addSql(
      `alter table if exists "product_variant_product_image" drop column if exists "created_by", drop column if exists "metadata";`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_product_option_value" cascade;`)

    this.addSql(
      `alter table if exists "product_variant_product_image" add column if not exists "created_by" text null, add column if not exists "metadata" jsonb null;`
    )
  }
}
