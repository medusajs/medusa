import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250919122137 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_attribute_operator_id" ON "promotion_rule" (operator, attribute, id) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_promotion_rule_attribute_operator_id";`
    )
  }
}
