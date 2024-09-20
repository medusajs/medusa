import { Migration } from "@mikro-orm/migrations"

export class Migration20240920122819 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "index_data" ("id" text not null, "name" text not null, "data" jsonb not null default \'{}\', constraint "index_data_pkey" primary key ("id", "name")) PARTITION BY LIST("name");'
    )

    this.addSql(
      'create table if not exists "index_relation" ("id" bigserial not null, "pivot" text not null, "parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "index_relation_pkey" primary key ("id", "pivot")) PARTITION BY LIST("pivot");'
    )
  }
}
