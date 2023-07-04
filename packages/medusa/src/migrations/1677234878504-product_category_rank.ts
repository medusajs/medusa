import { MigrationInterface, QueryRunner } from "typeorm"

export class productCategoryRank1677234878504 implements MigrationInterface {
  name = "productCategoryRank1677234878504"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "product_category"
      ADD COLUMN "rank" integer DEFAULT '0' NOT NULL CHECK ("rank" >= 0);
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UniqProductCategoryParentIdRank"
      ON "product_category" ("parent_category_id", "rank");
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "UniqProductCategoryParentIdRank";
    `)
    await queryRunner.query(`
      ALTER TABLE "product_category" DROP COLUMN "rank";
    `)
  }
}
