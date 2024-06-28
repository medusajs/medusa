import { Migration } from "@mikro-orm/migrations"

export class Migration20240626133555 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "price_list_rule" add column if not exists "value" jsonb;'
    )

    // TODO: Added on 28.06.2024, Drop defaults after a while.
    this.addSql(
      'alter table if exists "price_list_rule" add column if not exists "attribute" text not null DEFAULT \'\';'
    )

    this.addSql(
      'alter table if exists "price_rule" add column if not exists "attribute" text not null DEFAULT \'\';'
    )

    /* DATA MIGRATION */
    this.addSql(
      "update price_rule set attribute = (SELECT rule_attribute FROM rule_type WHERE rule_type.id = price_rule.rule_type_id);"
    )
    this.addSql(
      "update price_list_rule set value = (SELECT array_to_json(ARRAY(SELECT value FROM price_list_rule_value WHERE price_list_rule_value.price_list_rule_id = price_list_rule.id))::jsonb);"
    )
    this.addSql(
      "update price_list_rule set attribute = (SELECT rule_attribute FROM rule_type WHERE rule_type.id = price_list_rule.rule_type_id);"
    )
    /* DATA MIGRATION END */

    this.addSql(
      'alter table if exists "price_set_rule_type" drop constraint if exists "price_set_rule_type_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_rule" drop constraint if exists "price_rule_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_list_rule" drop constraint if exists "price_list_rule_rule_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "price_rule" drop constraint if exists "price_rule_price_set_id_foreign";'
    )

    this.addSql(
      'drop index if exists "IDX_price_list_rule_rule_type_id_unique";'
    )
    this.addSql('drop index if exists "IDX_price_rule_price_set_id";')
    this.addSql('drop index if exists "IDX_price_rule_rule_type_id";')
    this.addSql(
      'alter table if exists "price_rule" drop column if exists "price_set_id";'
    )
    this.addSql(
      'alter table if exists "price_rule" drop column if exists "rule_type_id";'
    )
    this.addSql(
      'alter table if exists "price_list_rule" drop column if exists "rule_type_id";'
    )

    this.addSql('drop table if exists "rule_type" cascade;')

    this.addSql('drop table if exists "price_set_rule_type" cascade;')

    this.addSql('drop table if exists "price_list_rule_value" cascade;')
  }
}
