import { MigrationInterface, QueryRunner } from "typeorm"

export class discountUsageCount1615970124120 implements MigrationInterface {
  name = "discountUsageCount1615970124120"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount_rule" ADD "usage_count" integer NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount_rule" DROP COLUMN "usage_count"`
    )
  }
}
