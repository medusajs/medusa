import { Migration } from "@mikro-orm/migrations"

export class Migration20231215090342 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "sales_channel" ("id" text not null, "name" text not null, "description" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "sales_channel_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_sales_channel_deleted_at" on "sales_channel" ("deleted_at");'
    )
  }
}
