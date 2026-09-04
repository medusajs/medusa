import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260802103000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX "IDX_price_list_rule_price_list_id_new" ON "price_list_rule" (price_list_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(`drop index if exists "IDX_price_list_rule_price_list_id";`)

    this.addSql(
      `ALTER INDEX "IDX_price_list_rule_price_list_id_new" RENAME TO "IDX_price_list_rule_price_list_id";`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `CREATE INDEX "IDX_price_list_rule_price_list_id_old" ON "price_list_rule" (price_list_id) WHERE deleted_at IS NOT NULL;`
    )

    this.addSql(`drop index if exists "IDX_price_list_rule_price_list_id";`)

    this.addSql(
      `ALTER INDEX "IDX_price_list_rule_price_list_id_old" RENAME TO "IDX_price_list_rule_price_list_id";`
    )
  }
}
