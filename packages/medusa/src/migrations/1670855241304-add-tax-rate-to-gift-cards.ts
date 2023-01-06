import { MigrationInterface, QueryRunner } from "typeorm"

export class addTaxRateToGiftCards1670855241304 implements MigrationInterface {
  name = "addTaxRateToGiftCards1670855241304"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card" ADD COLUMN IF NOT EXISTS tax_rate REAL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card" DROP COLUMN IF EXISTS "tax_rate"`
    )
  }
}
