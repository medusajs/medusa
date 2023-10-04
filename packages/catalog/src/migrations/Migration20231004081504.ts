import { Migration } from "@mikro-orm/migrations"

export class Migration20231004081504 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "catalog" ("id" text not null, "parent_ids" json null, "entity" text not null, "data" jsonb not null default \'{}\', constraint "catalog_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_catalog_parent_ids" on "catalog" ("parent_ids");'
    )
  }
}
