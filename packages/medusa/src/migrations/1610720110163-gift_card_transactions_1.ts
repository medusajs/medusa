import { MigrationInterface, QueryRunner } from "typeorm"

export class giftCardTransactions11610720110163 implements MigrationInterface {
  name = "giftCardTransactions11610720110163"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "FK_3ff5597f1d7e02bba41541846f4"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "FK_d7d441b81012f87d4265fa57d24"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "gcuniq" UNIQUE ("gift_card_id", "order_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "FK_3ff5597f1d7e02bba41541846f4" FOREIGN KEY ("gift_card_id") REFERENCES "gift_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "FK_d7d441b81012f87d4265fa57d24" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "FK_d7d441b81012f87d4265fa57d24"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "FK_3ff5597f1d7e02bba41541846f4"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "gcuniq"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "FK_d7d441b81012f87d4265fa57d24" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "FK_3ff5597f1d7e02bba41541846f4" FOREIGN KEY ("gift_card_id") REFERENCES "gift_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
