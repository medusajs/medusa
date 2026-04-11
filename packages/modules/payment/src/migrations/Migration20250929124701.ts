import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250929124701 extends Migration {
  override async up(): Promise<void> {
    // Step 1: Add the column as nullable
    this.addSql(`alter table "refund_reason" add column "code" text;`)

    // Step 2: Populate the code column from label (convert to snake_case)
    this.addSql(`
      update "refund_reason" 
      set "code" = lower(replace("label", ' ', '_'));
    `)

    // Step 3: Set the column to not nullable
    this.addSql(`alter table "refund_reason" alter column "code" set not null;`)
  }

  override async down(): Promise<void> {
    // Remove the code column
    this.addSql(`alter table "refund_reason" drop column "code";`)
  }
}
