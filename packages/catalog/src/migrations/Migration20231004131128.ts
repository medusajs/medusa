import { Migration } from '@mikro-orm/migrations';

export class Migration20231004131128 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "catalog" ("id" text not null, "children_ids" json null, "entity" text not null, "data" jsonb not null default \'{}\', constraint "catalog_pkey" primary key ("id"));');
    this.addSql('create index "IDX_catalog_children_ids" on "catalog" ("children_ids");');
  }

}
