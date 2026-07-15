import { Migration } from "@mikro-orm/migrations"

export class Migration20251113183352 extends Migration {
  override async up(): Promise<void> {
    // Populate product_product_option_value with all existing implicit relationships
    // For each product-option link, create links to all values of that option
    this.addSql(`
      insert into "product_product_option_value" ("id", "product_product_option_id", "product_option_value_id")
      select
        gen_random_uuid(),
        ppo.id,
        pov.id
      from "product_product_option" ppo
      inner join "product_option_value" pov on pov.option_id = ppo.product_option_id
      where ppo.deleted_at is null and pov.deleted_at is null;
    `)
  }

  override async down(): Promise<void> {
    // Remove all the records that were created by the up migration
    // This is a destructive operation and will remove the granular relationships
    this.addSql(`
      delete from "product_product_option_value"
      where "product_product_option_id" in (
        select id from "product_product_option" where deleted_at is null
      );
    `)
  }
}
