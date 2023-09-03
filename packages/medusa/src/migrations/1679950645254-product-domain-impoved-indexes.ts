import { MigrationInterface, QueryRunner } from "typeorm"

export class productDomainImprovedIndexes1679950645254
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // If you want to reset it to 'on' run 'set enable_nestloop to on;'
    // Improve large IN queries, since we have separate queries every time it is better to turn it off
    await queryRunner.query(`
      /* You can turn of this settings if you are in a context with lots of variants) set enable_nestloop to off; */
      
      DROP INDEX IF EXISTS "IDX_17a06d728e4cfbc5bd2ddb70af";
      CREATE INDEX IF NOT EXISTS idx_money_amount_variant_id ON money_amount (variant_id);

      DROP INDEX IF EXISTS "IDX_b433e27b7a83e6d12ab26b15b0";
      CREATE INDEX IF NOT EXISTS idx_money_amount_region_id ON money_amount (region_id);

      DROP INDEX IF EXISTS "IDX_7234ed737ff4eb1b6ae6e6d7b0";
      CREATE INDEX IF NOT EXISTS idx_product_option_value_variant_id ON product_option_value (variant_id);

      DROP INDEX IF EXISTS "IDX_cdf4388f294b30a25c627d69fe";
      CREATE INDEX IF NOT EXISTS idx_product_option_value_option_id ON product_option_value (option_id);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_money_amount_variant_id;
      DROP INDEX IF EXISTS idx_money_amount_region_id;
      DROP INDEX IF EXISTS idx_product_option_value_variant_id;
      DROP INDEX IF EXISTS idx_product_option_value_option_id;
      
      CREATE INDEX IF NOT EXISTS "IDX_17a06d728e4cfbc5bd2ddb70af" ON "money_amount" ("variant_id");
      CREATE INDEX IF NOT EXISTS "IDX_b433e27b7a83e6d12ab26b15b0" ON "money_amount" ("region_id");
      CREATE INDEX IF NOT EXISTS "IDX_7234ed737ff4eb1b6ae6e6d7b0" ON "product_option_value" ("variant_id");
      CREATE INDEX IF NOT EXISTS "IDX_cdf4388f294b30a25c627d69fe" ON "product_option_value" ("option_id");
    `)
  }
}
