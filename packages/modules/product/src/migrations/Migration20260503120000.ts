import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260503120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "product" alter column "weight" type numeric(10, 2) using "weight"::numeric(10, 2);`
    )
    this.addSql(
      `alter table if exists "product" alter column "length" type numeric(10, 2) using "length"::numeric(10, 2);`
    )
    this.addSql(
      `alter table if exists "product" alter column "height" type numeric(10, 2) using "height"::numeric(10, 2);`
    )
    this.addSql(
      `alter table if exists "product" alter column "width" type numeric(10, 2) using "width"::numeric(10, 2);`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "product" alter column "weight" type text using "weight"::text;`
    )
    this.addSql(
      `alter table if exists "product" alter column "length" type text using "length"::text;`
    )
    this.addSql(
      `alter table if exists "product" alter column "height" type text using "height"::text;`
    )
    this.addSql(
      `alter table if exists "product" alter column "width" type text using "width"::text;`
    )
  }
}
