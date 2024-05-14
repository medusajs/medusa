import { MigrationInterface, QueryRunner } from "typeorm"

export class dropFksIsolatedProducts1694602553610
  implements MigrationInterface
{
  name = "dropFksIsolatedProducts1694602553610"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE IF EXISTS "product_tax_rate" DROP CONSTRAINT IF EXISTS "FK_1d04aebeabb6a89f87e536a124d";
        ALTER TABLE IF EXISTS "product_type_tax_rate" DROP CONSTRAINT IF EXISTS "FK_25a3138bb236f63d9bb6c8ff111";
        ALTER TABLE IF EXISTS "claim_item" DROP CONSTRAINT IF EXISTS "FK_64980511ca32c8e92b417644afa";
        ALTER TABLE IF EXISTS "discount_condition_product" DROP CONSTRAINT IF EXISTS "FK_c759f53b2e48e8cfb50638fe4e0";
        ALTER TABLE IF EXISTS "discount_condition_product_collection" DROP CONSTRAINT IF EXISTS "FK_a0b05dc4257abe639cb75f8eae2";
        ALTER TABLE IF EXISTS "discount_condition_product_tag" DROP CONSTRAINT IF EXISTS "FK_01486cc9dc6b36bf658685535f6";
        ALTER TABLE IF EXISTS "discount_condition_product_type" DROP CONSTRAINT IF EXISTS "FK_e706deb68f52ab2756119b9e704";
        ALTER TABLE IF EXISTS "discount_rule_products" DROP CONSTRAINT IF EXISTS "FK_be66106a673b88a81c603abe7eb";

    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE IF EXISTS "product_tax_rate" ADD CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE cascade ON UPDATE NO ACTION;
        ALTER TABLE IF EXISTS "product_type_tax_rate" ADD CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE cascade ON UPDATE NO ACTION;
        ALTER TABLE IF EXISTS "claim_item" ADD CONSTRAINT "FK_64980511ca32c8e92b417644afa" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
        ALTER TABLE IF EXISTS discount_condition_product ADD CONSTRAINT "FK_c759f53b2e48e8cfb50638fe4e0" FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE NO ACTION ON DELETE CASCADE;
        ALTER TABLE IF EXISTS discount_condition_product_collection ADD CONSTRAINT "FK_a0b05dc4257abe639cb75f8eae2" FOREIGN KEY (product_collection_id) REFERENCES product_collection (id) ON UPDATE NO ACTION ON DELETE CASCADE;
        ALTER TABLE IF EXISTS discount_condition_product_tag ADD CONSTRAINT "FK_01486cc9dc6b36bf658685535f6" FOREIGN KEY (product_tag_id) REFERENCES product_tag (id) ON UPDATE NO ACTION ON DELETE CASCADE;
        ALTER TABLE IF EXISTS discount_condition_product_type ADD CONSTRAINT "FK_e706deb68f52ab2756119b9e704" FOREIGN KEY (product_type_id) REFERENCES product_type (id) ON UPDATE NO ACTION ON DELETE CASCADE;
        ALTER TABLE IF EXISTS discount_rule_products ADD CONSTRAINT "FK_be66106a673b88a81c603abe7eb" FOREIGN KEY (product_id) REFERENCES product (id) ON UPDATE NO ACTION ON DELETE CASCADE;
    `)
  }
}
