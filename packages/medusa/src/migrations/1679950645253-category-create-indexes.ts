import { MigrationInterface, QueryRunner } from "typeorm"

export class categoryCreateIndexes1679950645253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_product_category_active_public" ON "product_category" (
        "parent_category_id",
        "is_active",
        "is_internal"
      ) WHERE (
        ("is_active" IS TRUE) AND
        ("is_internal" IS FALSE)
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_product_category_active_public";
    `)
  }
}
