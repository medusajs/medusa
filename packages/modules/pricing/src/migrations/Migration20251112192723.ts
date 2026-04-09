import { Migration } from '@mikro-orm/migrations';

export class Migration20251112192723 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_price_currency_code_price_set_id_min_quantity";`);

    this.addSql(`alter table if exists "price" add column if not exists "raw_min_quantity" jsonb null, add column if not exists "raw_max_quantity" jsonb null;`);
    this.addSql(`alter table if exists "price" alter column "min_quantity" type numeric using ("min_quantity"::numeric);`);
    this.addSql(`alter table if exists "price" alter column "max_quantity" type numeric using ("max_quantity"::numeric);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "price" drop column if exists "raw_min_quantity", drop column if exists "raw_max_quantity";`);

    this.addSql(`alter table if exists "price" alter column "min_quantity" type integer using ("min_quantity"::integer);`);
    this.addSql(`alter table if exists "price" alter column "max_quantity" type integer using ("max_quantity"::integer);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_price_currency_code_price_set_id_min_quantity" ON "price" (currency_code, price_set_id, min_quantity) WHERE deleted_at IS NULL;`);
  }

}
