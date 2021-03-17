import { MigrationInterface, QueryRunner } from "typeorm"

export class discountUsageCount1615912118791 implements MigrationInterface {
  name = "discountUsageCount1615912118791"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount_rule" ADD "usage_count" integer`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount_rule" DROP COLUMN "usage_count"`
    )
  }
}
