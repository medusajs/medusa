import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250127105159 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "index_relation" alter column "id" set not null;`
    )
    this.addSql(
      `alter table if exists "index_relation" add constraint "IDX_index_relation_id_pivot_parent_name_child_name_parent_id_child_id_unique" unique ("parent_id", "child_id", "child_name", "parent_name", "pivot");`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "index_relation" drop constraint "IDX_index_relation_id_pivot_parent_name_child_name_parent_id_child_id_unique";`
    )
    this.addSql(
      `alter table if exists "index_relation" alter column "id" drop not null;`
    )
  }
}
