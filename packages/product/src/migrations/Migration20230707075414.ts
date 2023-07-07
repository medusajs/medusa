import { Migration } from "@mikro-orm/migrations"

export class Migration20230707075414 extends Migration {
  async up(): Promise<void> {
    this.addSql('create index "IDX_product_image_url" on "image" ("url");')
  }

  async down(): Promise<void> {
    this.addSql('drop index "IDX_product_image_url";')
  }
}
