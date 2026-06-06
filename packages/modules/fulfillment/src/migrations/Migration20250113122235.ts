import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250113122235 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"true"'
      WHERE value = '"\\"true\\""';
    `)
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"false"'
      WHERE value = '"\\"false\\""';
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"\\"true\\""'
      WHERE value = '"true"';
    `)
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"\\"false\\""'
      WHERE value = '"false"';
    `)
  }
}
