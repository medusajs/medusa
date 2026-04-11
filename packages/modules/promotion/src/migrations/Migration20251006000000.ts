import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251006000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `ALTER TABLE "promotion_application_method" DROP CONSTRAINT IF EXISTS "promotion_application_method_allocation_check";`
    )
    this.addSql(
      `ALTER TABLE "promotion_application_method" ADD CONSTRAINT "promotion_application_method_allocation_check" CHECK ("allocation" IN ('each', 'across', 'once'));`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE "promotion_application_method" DROP CONSTRAINT IF EXISTS "promotion_application_method_allocation_check";`
    )
    this.addSql(
      `ALTER TABLE "promotion_application_method" ADD CONSTRAINT "promotion_application_method_allocation_check" CHECK ("allocation" IN ('each', 'across'));`
    )
  }
}
