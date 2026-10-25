import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261022054302 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "order_tag" drop constraint if exists "order_tag_value_unique";`);
    this.addSql(`create table if not exists "order_tag" ("id" text not null, "value" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "order_tag_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_tag_deleted_at" ON "order_tag" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_order_tag_value_unique" ON "order_tag" ("value") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "order_order_tags" ("order_id" text not null, "order_tag_id" text not null, constraint "order_order_tags_pkey" primary key ("order_id", "order_tag_id"));`);

    this.addSql(`alter table if exists "order_order_tags" add constraint "order_order_tags_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "order_order_tags" add constraint "order_order_tags_order_tag_id_foreign" foreign key ("order_tag_id") references "order_tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table if exists "order_line_item_tax_line" add column if not exists "metadata" jsonb null, add column if not exists "data" jsonb null;`);

    this.addSql(`alter table if exists "order_shipping_method_tax_line" add column if not exists "metadata" jsonb null, add column if not exists "data" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "order_order_tags" drop constraint if exists "order_order_tags_order_tag_id_foreign";`);

    this.addSql(`drop table if exists "order_tag" cascade;`);

    this.addSql(`drop table if exists "order_order_tags" cascade;`);

    this.addSql(`alter table if exists "order_line_item_tax_line" drop column if exists "metadata", drop column if exists "data";`);

    this.addSql(`alter table if exists "order_shipping_method_tax_line" drop column if exists "metadata", drop column if exists "data";`);
  }

}
