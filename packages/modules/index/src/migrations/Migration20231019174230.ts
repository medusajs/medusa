import { Migration } from "@mikro-orm/migrations"

export class Migration20231019174230 extends Migration {
  async up(): Promise<void> {
    const schema = this.config.get("schema")
      ? `"${this.config.get("schema")}".`
      : ""

    this.addSql(
      `create table ${schema}"catalog" ("id" text not null, "name" text not null, "data" jsonb not null default '{}', constraint "catalog_pkey" primary key ("id", "name")) PARTITION BY LIST("name");`
    )
    this.addSql(`create index "IDX_catalog_id" on ${schema}"catalog" ("id");`)
    this.addSql(
      `create index "IDX_catalog_name" on ${schema}"catalog" ("name");`
    )
    this.addSql(
      `create index "IDX_catalog_data_gin" on ${schema}"catalog" using GIN ("data");`
    )

    this.addSql(
      `create table ${schema}"catalog_relation" ("id" bigserial, "pivot" text not null, "parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "catalog_relation_pkey" primary key ("id", "pivot")) PARTITION BY LIST("pivot");`
    )
    this.addSql(
      `create index "IDX_catalog_relation_child_id" on ${schema}"catalog_relation" ("child_id");`
    )
  }
}
