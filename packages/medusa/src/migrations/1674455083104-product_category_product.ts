import { MigrationInterface, QueryRunner } from "typeorm";

export class productCategoryProduct1674455083104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE "product_category_product" (
          "product_category_id" character varying NOT NULL,
          "product_id" character varying NOT NULL,
          CONSTRAINT "FK_product_category_id" FOREIGN KEY ("product_category_id") REFERENCES product_category("id") ON DELETE CASCADE ON UPDATE NO ACTION,
          CONSTRAINT "FK_product_id" FOREIGN KEY ("product_id") REFERENCES product("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
