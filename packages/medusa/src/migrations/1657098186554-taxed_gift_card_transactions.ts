import { MigrationInterface, QueryRunner } from "typeorm"

export class taxedGiftCardTransactions1657098186554
  implements MigrationInterface
{
  name = "taxedGiftCardTransactions1657098186554"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD "is_taxable" boolean`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD "tax_rate" real`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP COLUMN "is_taxable"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP COLUMN "tax_rate"`
    )
  }
}
