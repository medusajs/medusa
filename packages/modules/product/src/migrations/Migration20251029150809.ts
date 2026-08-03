import { Migration } from '@mikro-orm/migrations';

export class Migration20251029150809 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product_option_value" add column if not exists "rank" integer null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product_option_value" drop column if exists "rank";`);
  }

}
