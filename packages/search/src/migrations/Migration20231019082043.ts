import { Migration } from '@mikro-orm/migrations';

export class Migration20231019082043 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "catalog" ("id" text not null, "name" text not null, "data" jsonb not null default \'{}\', constraint "catalog_pkey" primary key ("id", "name"));');
    this.addSql('create index "IDX_catalog_id" on "catalog" ("id");');
    this.addSql('create index "IDX_catalog_name" on "catalog" ("name");');
    this.addSql('create index "IDX_catalog_data_gin" on "catalog" using GIN ("data");');

    this.addSql('create table "catalog_relation" ("id" serial, "parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "catalog_relation_pkey" primary key ("id"));');
    this.addSql('create index "IDX_catalog_relation_parent_id_child_id" on "catalog_relation" ("parent_id", "child_id");');
    this.addSql('create index "IDX_catalog_relation_parent_name_child_name" on "catalog_relation" ("parent_name", "child_name");');
  }

}
