import { Migration } from '@mikro-orm/migrations';

export class Migration20230517145318 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "product_variant" drop constraint "product_variant_product_id_foreign";');

    this.addSql('alter table "product_option" add column "deleted_at" timestamptz null;');

    this.addSql('drop index "IDX_product_variant_product_id";');
    this.addSql('alter table "product_variant" add constraint "product_variant_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "product_option_value" add column "deleted_at" timestamptz null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "product_variant" drop constraint "product_variant_product_id_foreign";');

    this.addSql('alter table "product_option" drop column "deleted_at";');

    this.addSql('alter table "product_variant" add constraint "product_variant_product_id_foreign" foreign key ("product_id") references "product" ("product_id") on update cascade on delete cascade;');
    this.addSql('create index "IDX_product_variant_product_id" on "product_variant" ("product_id");');

    this.addSql('alter table "product_option_value" drop column "deleted_at";');
  }

}
