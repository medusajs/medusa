import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261022061852 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "order_tags" ("order_id" text not null, "order_tag_id" text not null, constraint "order_tags_pkey" primary key ("order_id", "order_tag_id"));`);

    this.addSql(`alter table if exists "order_tags" add constraint "order_tags_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "order_tags" add constraint "order_tags_order_tag_id_foreign" foreign key ("order_tag_id") references "order_tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "order_order_tags" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "order_order_tags" ("order_id" text not null, "order_tag_id" text not null, constraint "order_order_tags_pkey" primary key ("order_id", "order_tag_id"));`);

    this.addSql(`alter table if exists "order_order_tags" add constraint "order_order_tags_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "order_order_tags" add constraint "order_order_tags_order_tag_id_foreign" foreign key ("order_tag_id") references "order_tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "order_tags" cascade;`);
  }

}
