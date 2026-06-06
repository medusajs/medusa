import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250326151602 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "cart_line_item" add column if not exists "is_giftcard" boolean not null default false;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "cart_line_item" drop column if exists "is_giftcard";`
    )
  }
}
