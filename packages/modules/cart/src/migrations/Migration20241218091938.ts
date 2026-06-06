import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20241218091938 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "cart_line_item" add column if not exists "is_custom_price" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "cart_line_item" drop column if exists "is_custom_price";');
  }

}
