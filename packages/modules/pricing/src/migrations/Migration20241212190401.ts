import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241212190401 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `UPDATE price_list_rule SET attribute = 'customer.groups.id' WHERE attribute = 'customer_group_id';`
    )
  }

  async down(): Promise<void> {}
}
