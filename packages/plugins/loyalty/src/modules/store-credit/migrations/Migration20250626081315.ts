import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250520081315 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "store_credit_account" add column "code" text;`
    );
    this.addSql(
      `create unique index if not exists "IDX_store_credit_account_code_unique" on "store_credit_account" (code) where deleted_at is null;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "store_credit_account" drop column "code";`
    );
    this.addSql(`drop index if exists "IDX_store_credit_account_code_unique";`);
  }
}
