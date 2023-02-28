import { MigrationInterface, QueryRunner } from "typeorm"

export class productCategoryPosition1677234878504 implements MigrationInterface {
  name = "productCategoryPosition1677234878504"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_category"
      ADD COLUMN "position" integer DEFAULT '0' NOT NULL CHECK ("position" >= 0);
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UniqProductCategoryParentIdPosition"
      ON "product_category" ("parent_category_id", "position");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "UniqProductCategoryParentIdPosition";
    `)
    await queryRunner.query(`
      ALTER TABLE "product_category" DROP COLUMN "product_category";
    `)
  }
}
