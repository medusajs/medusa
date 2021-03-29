import { MigrationInterface, QueryRunner } from "typeorm"

export class discountUsage1617002207608 implements MigrationInterface {
  name = "discountUsage1617002207608"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "discount_rule" DROP COLUMN "usage_limit"`
    )
    await queryRunner.query(
      `ALTER TABLE "discount_rule" DROP COLUMN "usage_count"`
    )
    await queryRunner.query(`ALTER TABLE "discount" ADD "usage_limit" integer`)
    await queryRunner.query(
      `ALTER TABLE "discount" ADD "usage_count" integer NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "usage_count"`)
    await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "usage_limit"`)
    await queryRunner.query(
      `ALTER TABLE "discount_rule" ADD "usage_count" integer NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "discount_rule" ADD "usage_limit" integer`
    )
  }
}
