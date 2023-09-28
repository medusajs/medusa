import { Migration } from "@mikro-orm/migrations"

export class Migration20230928145109 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create index "IDX_price_rule_price_set_id" on "price_rule" ("price_set_id");'
    )
    this.addSql(
      'create index "IDX_price_rule_rule_type_id" on "price_rule" ("rule_type_id");'
    )
    this.addSql(
      'create index "IDX_price_rule_price_set_money_amount_id" on "price_rule" ("price_set_money_amount_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index "IDX_price_rule_price_set_id";')
    this.addSql('drop index "IDX_price_rule_rule_type_id";')
    this.addSql('drop index "IDX_price_rule_price_set_money_amount_id";')
  }
}
