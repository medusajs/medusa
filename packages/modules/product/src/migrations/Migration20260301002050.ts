import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260301002050 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "product" drop column if exists "raw_weight", drop column if exists "raw_length", drop column if exists "raw_height", drop column if exists "raw_width";`);

    this.addSql(`alter table if exists "product" alter column "weight" type real using ("weight"::real);`);
    this.addSql(`alter table if exists "product" alter column "length" type real using ("length"::real);`);
    this.addSql(`alter table if exists "product" alter column "height" type real using ("height"::real);`);
    this.addSql(`alter table if exists "product" alter column "width" type real using ("width"::real);`);

    this.addSql(`alter table if exists "product_variant" drop column if exists "raw_weight", drop column if exists "raw_length", drop column if exists "raw_height", drop column if exists "raw_width";`);

    this.addSql(`alter table if exists "product_variant" alter column "weight" type real using ("weight"::real);`);
    this.addSql(`alter table if exists "product_variant" alter column "length" type real using ("length"::real);`);
    this.addSql(`alter table if exists "product_variant" alter column "height" type real using ("height"::real);`);
    this.addSql(`alter table if exists "product_variant" alter column "width" type real using ("width"::real);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "product" add column if not exists "raw_weight" jsonb null, add column if not exists "raw_length" jsonb null, add column if not exists "raw_height" jsonb null, add column if not exists "raw_width" jsonb null;`);
    this.addSql(`alter table if exists "product" alter column "weight" type numeric using ("weight"::numeric);`);
    this.addSql(`alter table if exists "product" alter column "length" type numeric using ("length"::numeric);`);
    this.addSql(`alter table if exists "product" alter column "height" type numeric using ("height"::numeric);`);
    this.addSql(`alter table if exists "product" alter column "width" type numeric using ("width"::numeric);`);

    this.addSql(`alter table if exists "product_variant" add column if not exists "raw_weight" jsonb null, add column if not exists "raw_length" jsonb null, add column if not exists "raw_height" jsonb null, add column if not exists "raw_width" jsonb null;`);
    this.addSql(`alter table if exists "product_variant" alter column "weight" type numeric using ("weight"::numeric);`);
    this.addSql(`alter table if exists "product_variant" alter column "length" type numeric using ("length"::numeric);`);
    this.addSql(`alter table if exists "product_variant" alter column "height" type numeric using ("height"::numeric);`);
    this.addSql(`alter table if exists "product_variant" alter column "width" type numeric using ("width"::numeric);`);
  }

}
