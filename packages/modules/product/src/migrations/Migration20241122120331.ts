import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20241122120331 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "image" add column if not exists "rank" integer not null default 0, add column if not exists "product_id" text null;');
    
    // Migrate existing relationships
    this.addSql(`
      update "image" i
      set product_id = pi.product_id,
          rank = (
            select count(*) 
            from product_images pi2 
            where pi2.product_id = pi.product_id 
            and pi2.image_id <= pi.image_id
          ) - 1
      from "product_images" pi
      where pi.image_id = i.id;
    `);

    // Delete orphaned images
    this.addSql(`
      delete from "image"
      where product_id is null;
    `);

    this.addSql('alter table if exists "image" alter column "product_id" set not null;');
    this.addSql('alter table if exists "image" add constraint "image_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('drop table if exists "product_images" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "product_images" ("product_id" text not null, "image_id" text not null, constraint "product_images_pkey" primary key ("product_id", "image_id"));');

    // Migrate relationships back to join table
    this.addSql(`
      insert into "product_images" (product_id, image_id)
      select product_id, id
      from "image"
      where product_id is not null;
    `);

    this.addSql('alter table if exists "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "product_images" add constraint "product_images_image_id_foreign" foreign key ("image_id") references "image" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "image" drop constraint if exists "image_product_id_foreign";');
    this.addSql('alter table if exists "image" drop column if exists "rank";');
    this.addSql('alter table if exists "image" drop column if exists "product_id";');
  }

}
