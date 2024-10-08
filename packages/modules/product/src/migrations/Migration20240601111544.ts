import { Migration } from "@mikro-orm/migrations"

export class Migration20240601111544 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "product_category" alter column "rank" type integer using ("rank"::integer);'
    )

    this.addSql(
      'alter table if exists "product_variant" alter column "variant_rank" type integer using ("variant_rank"::integer);'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "product_category" alter column "rank" type numeric using ("rank"::numeric);'
    )

    this.addSql(
      'alter table if exists "product_variant" alter column "variant_rank" type numeric using ("variant_rank"::numeric);'
    )
  }
}
