import { MigrationInterface, QueryRunner } from "typeorm"

export class categoryRemoveSoftDelete1679950221063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "product_category" WHERE "deleted_at" IS NOT NULL;`)
    await queryRunner.query(`ALTER TABLE "product_category" DROP COLUMN "deleted_at";`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_category_handle";`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_product_category_handle" ON "product_category" ("handle");`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_category_handle";`)
    await queryRunner.query(`ALTER TABLE "product_category" ADD COLUMN "deleted_at" timestamp with time zone;`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_product_category_handle" ON "product_category" ("handle") WHERE deleted_at IS NULL;`
    )
  }
}
