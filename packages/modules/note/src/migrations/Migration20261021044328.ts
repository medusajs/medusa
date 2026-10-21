import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261021044328 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "note" ("id" text not null, "resource_type" text check ("resource_type" in ('order', 'customer', 'order_line_item')) not null, "resource_id" text not null, "value" text not null, "author_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "note_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_note_deleted_at" ON "note" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_note_resource_type_resource_id" ON "note" ("resource_type", "resource_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "note" cascade;`);
  }

}
