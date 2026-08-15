import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260815185216 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "inventory_item" add column if not exists "unit_of_measure" text null;`);

    this.addSql(`alter table if exists "inventory_level" alter column "raw_stocked_quantity" type jsonb using ("raw_stocked_quantity"::jsonb);`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_stocked_quantity" set default '{"value":"0","precision":20}';`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_reserved_quantity" type jsonb using ("raw_reserved_quantity"::jsonb);`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_reserved_quantity" set default '{"value":"0","precision":20}';`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_incoming_quantity" type jsonb using ("raw_incoming_quantity"::jsonb);`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_incoming_quantity" set default '{"value":"0","precision":20}';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "inventory_item" drop column if exists "unit_of_measure";`);

    this.addSql(`alter table if exists "inventory_level" alter column "raw_stocked_quantity" drop default;`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_stocked_quantity" type jsonb using ("raw_stocked_quantity"::jsonb);`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_reserved_quantity" drop default;`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_reserved_quantity" type jsonb using ("raw_reserved_quantity"::jsonb);`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_incoming_quantity" drop default;`);
    this.addSql(`alter table if exists "inventory_level" alter column "raw_incoming_quantity" type jsonb using ("raw_incoming_quantity"::jsonb);`);
  }

}
