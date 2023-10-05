import { Migration } from '@mikro-orm/migrations';

export class Migration20231005162549 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "catalog" ("id" text not null, "name" text not null, "data" jsonb not null default \'{}\', constraint "catalog_pkey" primary key ("id", "name"));');

    this.addSql('create table "catalog_relation" ("parent_id" text not null, "parent_name" text not null, "child_id" text not null, "child_name" text not null, constraint "catalog_relation_pkey" primary key ("parent_id", "parent_name", "child_id", "child_name"));');

    this.addSql('alter table "catalog_relation" add constraint "catalog_relation_parent_id_parent_name_foreign" foreign key ("parent_id", "parent_name") references "catalog" ("id", "name") on update cascade on delete cascade;');
    this.addSql('alter table "catalog_relation" add constraint "catalog_relation_child_id_child_name_foreign" foreign key ("child_id", "child_name") references "catalog" ("id", "name") on update cascade on delete cascade;');
  }

}
