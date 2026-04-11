import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250916120552 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_attribute_operator" ON "promotion_rule" (attribute, operator) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_promotion_rule_attribute_operator";`)
  }
}
