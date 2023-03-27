import { MigrationInterface, QueryRunner } from "typeorm"

export class categoryCreateIndexes1679950645253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_product_category_active_public" ON "product_category" (
        "is_internal",
        "is_active",
        "parent_category_id"
      ) WHERE (
        ("is_internal" IS FALSE) AND
        ("is_active" IS TRUE) AND
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_product_category_active_public";
    `)
  }
}
