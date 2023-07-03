import { Migration } from "@mikro-orm/migrations"

export class Migration20230703120341 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "image" ("id" text not null, "url" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "image_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "product_images" ("product_id" text not null, "product_image_id" text not null, constraint "product_images_pkey" primary key ("product_id", "product_image_id"));'
    )

    this.addSql(
      'alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "product_images" add constraint "product_images_product_image_id_foreign" foreign key ("product_image_id") references "image" ("id") on update cascade on delete cascade;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_images" drop constraint "product_images_product_image_id_foreign";'
    )

    this.addSql('drop table if exists "image" cascade;')

    this.addSql('drop table if exists "product_images" cascade;')
  }
}
