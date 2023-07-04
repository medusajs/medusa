import { MigrationInterface, QueryRunner } from "typeorm"

export class orderTaxRateToRealType1638543550000 implements MigrationInterface {
  name = "orderTaxRateToRealType1638543550000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" TYPE REAL`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ALTER COLUMN "tax_rate" TYPE REAL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" TYPE INTEGER`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ALTER COLUMN "tax_rate" TYPE NUMERIC`
    )
  }
}
