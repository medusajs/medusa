import { MigrationInterface, QueryRunner } from "typeorm";

export class productCategoryProduct1674455083104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE "product_category_product" (
          "id" character varying NOT NULL,
          "product_category_id" character varying NOT NULL,
          "product_id" character varying NOT NULL,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_product_category_product_id" PRIMARY KEY ("id")
        )
      `
    )

    await queryRunner.query(
      `
        CREATE UNIQUE INDEX "IDX_upcp_product_id_product_category_id"
        ON "product_category_product" ("product_category_id", "product_id")
      `
    )

    await queryRunner.query(
      `
        CREATE INDEX "IDX_pcp_product_category_id"
        ON "product_category_product" ("product_category_id")
      `
    )

    await queryRunner.query(
      `
        CREATE INDEX "IDX_pcp_product_id"
        ON "product_category_product" ("product_id")
      `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_upcp_product_id_product_category_id"`)
    await queryRunner.query(`DROP INDEX "IDX_pcp_product_category_id"`)
    await queryRunner.query(`DROP INDEX "IDX_pcp_product_id"`)

    await queryRunner.query(`DROP TABLE "product_category_product"`)
  }
}
