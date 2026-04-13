import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250520081315 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "store_credit_account" alter column "customer_id" type text using ("customer_id"::text);`);
    this.addSql(`alter table if exists "store_credit_account" alter column "customer_id" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "store_credit_account" alter column "customer_id" type text using ("customer_id"::text);`);
    this.addSql(`alter table if exists "store_credit_account" alter column "customer_id" set not null;`);
  }

}
