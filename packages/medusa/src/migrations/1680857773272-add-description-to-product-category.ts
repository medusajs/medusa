import { MigrationInterface, QueryRunner } from "typeorm"

export class addDescriptionToProductCategory1680857773272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT ''`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP COLUMN IF EXISTS "description"`
    )
  }
}
