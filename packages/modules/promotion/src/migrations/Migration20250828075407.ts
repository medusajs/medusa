import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250828075407 extends Migration {
  override async up(): Promise<void> {
    const nullApplyToQuantityResult = await this.execute(`
      SELECT COUNT(*) as count 
      FROM promotion_application_method pam
      JOIN promotion p ON pam.promotion_id = p.id
      WHERE p.type = 'buyget' 
      AND pam.apply_to_quantity IS NULL
    `)

    const resultCount = parseInt(nullApplyToQuantityResult[0]?.count)

    if (resultCount > 0) {
      console.log(
        `Warning: Found ${resultCount} buy-get promotions with null apply_to_quantity. These should be fixed as apply_to_quantity is required for proper buy-get promotion functionality.`
      )
    }

    this.addSql(`
      UPDATE promotion_application_method 
      SET max_quantity = apply_to_quantity 
      WHERE promotion_id IN (
        SELECT id FROM promotion WHERE type = 'buyget'
      ) 
      AND apply_to_quantity IS NOT NULL
    `)
  }

  override async down(): Promise<void> {
    // Note: This migration cannot be safely rolled back as we don't store
    // the original max_quantity values. If rollback is needed,
    // the original values would need to be restored manually.
  }
}
