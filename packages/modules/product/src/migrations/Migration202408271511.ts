import { Migration } from "@mikro-orm/migrations"

export class Migration202408271511 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "product_category" add column if not exists "metadata" jsonb;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "product_category" drop column if exists "metadata";'
    )
  }
}
