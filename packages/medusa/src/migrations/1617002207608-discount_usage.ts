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
    await queryRunner.query(
      `ALTER TABLE "discount_rule" ALTER COLUMN "description" DROP NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "discount_rule"."description" IS NULL`
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
    await queryRunner.query(
      `COMMENT ON COLUMN "discount_rule"."description" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "discount_rule" ALTER COLUMN "description" SET NOT NULL`
    )
  }
}
