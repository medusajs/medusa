import { Migration } from "@mikro-orm/migrations"

export class Migration20231019174230 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "index_data" ("id" text not null, "name" text not null, "data" jsonb not null default '{}', constraint "index_data_pkey" primary key ("id", "name")) PARTITION BY LIST("name");`
    )
    this.addSql(`create index "IDX_index_data_id" on "index_data" ("id");`)
    this.addSql(`create index "IDX_index_data_name" on "index_data" ("name");`)
    this.addSql(
      `create index "IDX_index_data_gin" on "index_data" using GIN ("data");`
    )

    this.addSql(
      `create table "index_relation" ("id" bigserial, "pivot" text not null, "parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "index_relation_pkey" primary key ("id", "pivot")) PARTITION BY LIST("pivot");`
    )
    this.addSql(
      `create index "IDX_index_relation_child_id" on "index_relation" ("child_id");`
    )
  }
}
