import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251028172715 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "notification" alter column "template" type text using ("template"::text);`
    )
    this.addSql(
      `alter table if exists "notification" alter column "template" drop not null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "notification" alter column "template" type text using ("template"::text);`
    )
    this.addSql(
      `alter table if exists "notification" alter column "template" set not null;`
    )
  }
}
