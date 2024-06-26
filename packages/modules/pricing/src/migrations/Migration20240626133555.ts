import { Migration } from "@mikro-orm/migrations"

export class Migration20240626133555 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "price_set_rule_type" drop constraint if exists "price_set_rule_type_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_rule" drop constraint if exists "price_rule_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_list_rule" drop constraint if exists "price_list_rule_rule_type_id_foreign";'
    )

    this.addSql('drop table if exists "rule_type" cascade;')

    this.addSql('drop table if exists "price_set_rule_type" cascade;')

    this.addSql('drop table if exists "price_list_rule_value" cascade;')

    this.addSql(
      'alter table if exists "price_rule" drop constraint if exists "price_rule_price_set_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_list_rule" add column if not exists "value" jsonb;'
    )

    this.addSql(
      'drop index if exists "IDX_price_list_rule_rule_type_id_unique";'
    )
    this.addSql(
      'alter table if exists "price_list_rule" rename column "rule_type_id" to "attribute";'
    )

    this.addSql(
      'alter table if exists "price_rule" add column if not exists "attribute" text not null;'
    )
    this.addSql('drop index if exists "IDX_price_rule_price_set_id";')
    this.addSql('drop index if exists "IDX_price_rule_rule_type_id";')
    this.addSql(
      'alter table if exists "price_rule" drop column if exists "price_set_id";'
    )
    this.addSql(
      'alter table if exists "price_rule" drop column if exists "rule_type_id";'
    )
  }
}
