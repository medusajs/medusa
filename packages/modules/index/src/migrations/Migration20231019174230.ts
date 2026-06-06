import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20231019174230 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table IF NOT EXISTS "index_data" ("id" text not null, "name" text not null, "data" jsonb not null default '{}', constraint "index_data_pkey" primary key ("id", "name")) PARTITION BY LIST("name");`
    )

    this.addSql(
      `create table IF NOT EXISTS "index_relation" ("id" bigserial, "pivot" text not null, "parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "index_relation_pkey" primary key ("id", "pivot")) PARTITION BY LIST("pivot");`
    )
  }
}
