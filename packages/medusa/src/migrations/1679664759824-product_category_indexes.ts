import { MigrationInterface, QueryRunner } from "typeorm"

export class productCategoryIndexes1679664759824 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_product_category_parent_category_id" ON "product_category" ("parent_category_id");
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_product_category_rank" ON "product_category" ("rank");
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_product_category_is_internal" ON "product_category" ("is_internal");
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_product_category_is_public" ON "product_category" ("is_public");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_product_category_parent_category_id";
    `)
    await queryRunner.query(`
      DROP INDEX "IDX_product_category_rank";
    `)
    await queryRunner.query(`
      DROP INDEX "IDX_product_category_is_internal";
    `)
    await queryRunner.query(`
      DROP INDEX "IDX_product_category_is_public";
    `)
  }
}
