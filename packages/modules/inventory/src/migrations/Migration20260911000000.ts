import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260911000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "inventory_item" alter column "weight" type real using ("weight"::real);`
    )
    this.addSql(
      `alter table if exists "inventory_item" alter column "length" type real using ("length"::real);`
    )
    this.addSql(
      `alter table if exists "inventory_item" alter column "height" type real using ("height"::real);`
    )
    this.addSql(
      `alter table if exists "inventory_item" alter column "width" type real using ("width"::real);`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "inventory_item" alter column "weight" type int using ("weight"::int);`
    )
    this.addSql(
      `alter table if exists "inventory_item" alter column "length" type int using ("length"::int);`
    )
    this.addSql(
      `alter table if exists "inventory_item" alter column "height" type int using ("height"::int);`
    )
    this.addSql(
      `alter table if exists "inventory_item" alter column "width" type int using ("width"::int);`
    )
  }
}

