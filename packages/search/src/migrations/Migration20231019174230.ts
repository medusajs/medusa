import { Migration } from "@mikro-orm/migrations"

export class Migration20231019174230 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "catalog" ("id" text not null, "name" text not null, "data" jsonb not null default \'{}\', constraint "catalog_pkey" primary key ("id", "name")) PARTITION BY LIST("name");'
    )
    this.addSql('create index "IDX_catalog_id" on "catalog" ("id");')
    this.addSql('create index "IDX_catalog_name" on "catalog" ("name");')
    this.addSql(
      'create index "IDX_catalog_data_gin" on "catalog" using GIN ("data");'
    )

    this.addSql(
      'create table "catalog_relation" ("id" bigserial, "pivot" text not null, "parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "catalog_relation_pkey" primary key ("id", "pivot")) PARTITION BY LIST("pivot");'
    )
    this.addSql(
      'create index "IDX_catalog_relation_child_id" on "catalog_relation" ("child_id");'
    )
  }
}
