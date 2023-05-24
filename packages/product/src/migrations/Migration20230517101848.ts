import { Migration } from "@mikro-orm/migrations"

export class Migration20230517101848 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "product_category" ("id" text not null, "name" text not null, "description" text not null default \'\', "handle" text not null, "mpath" text null, "is_active" boolean not null default false, "is_internal" boolean not null default false, "rank" numeric not null default 0, "parent_category_id" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_category_pkey" primary key ("id"));'
    )
    this.addSql(
      'CREATE UNIQUE INDEX "IDX_product_category_handle" ON "product_category" ("handle");'
    )
    this.addSql(
      'CREATE INDEX "IDX_product_category_path" ON "product_category" ("mpath");'
    )

    this.addSql(
      'create table "product_option" ("id" text not null, "title" text not null, "product_id" text not null, "metadata" jsonb null, constraint "product_option_pkey" primary key ("id"));'
    )

    this.addSql(
      'CREATE INDEX "IDX_product_option_product_id" ON "product_option" ("product_id") WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'create table "product_category_product" ("product_id" text not null, "product_category_id" text not null, constraint "product_category_product_pkey" primary key ("product_id", "product_category_id"));'
    )

    this.addSql(
      'create table "product_option_value" ("id" text not null, "value" text not null, "option_id" text not null, "variant_id" text not null, "metadata" jsonb null, constraint "product_option_value_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_product_option_value_product_option" on "product_option_value" ("option_id");'
    )

    this.addSql(
      'alter table "product_category" add constraint "product_category_parent_category_id_foreign" foreign key ("parent_category_id") references "product_category" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "product_option" add constraint "product_option_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "product_category_product" add constraint "product_category_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "product_category_product" add constraint "product_category_product_product_category_id_foreign" foreign key ("product_category_id") references "product_category" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "product_option_value" add constraint "product_option_value_option_id_foreign" foreign key ("option_id") references "product_option" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "product_option_value" add constraint "product_option_value_variant_id_foreign" foreign key ("variant_id") references "product_variant" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "product_variant" add column "product_id" text not null;'
    )
    this.addSql(
      'create index "IDX_product_variant_product_id" on "product_variant" ("product_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_category" drop constraint "product_category_parent_category_id_foreign";'
    )

    this.addSql(
      'alter table "product_category_product" drop constraint "product_category_product_product_category_id_foreign";'
    )

    this.addSql(
      'alter table "product_option_value" drop constraint "product_option_value_option_id_foreign";'
    )

    this.addSql('drop table if exists "product_category" cascade;')

    this.addSql('drop table if exists "product_option" cascade;')

    this.addSql('drop table if exists "product_category_product" cascade;')

    this.addSql('drop table if exists "product_option_value" cascade;')

    this.addSql('alter table "product_variant" drop column "product_id";')
  }
}
