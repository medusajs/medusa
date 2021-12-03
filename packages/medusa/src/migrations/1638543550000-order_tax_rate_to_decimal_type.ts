import { MigrationInterface, QueryRunner } from "typeorm"

export class orderTaxRateToDecimalType1638543550000
  implements MigrationInterface {
  name = "orderTaxRateToDecimalType1638543550000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" TYPE numeric`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "tax_rate" TYPE integer`
    )
  }
}
