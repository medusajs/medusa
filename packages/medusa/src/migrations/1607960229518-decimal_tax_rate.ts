import { MigrationInterface, QueryRunner } from "typeorm"

export class decimalTaxRate1607960229518 implements MigrationInterface {
  name = "decimalTaxRate1607960229518"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "region" ALTER COLUMN "tax_rate" TYPE numeric`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "region" ALTER COLUMN "tax_rate" TYPE integer`
    )
  }
}
