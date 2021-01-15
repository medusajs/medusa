import { MigrationInterface, QueryRunner } from "typeorm"

export class giftCardTransactions21610720509376 implements MigrationInterface {
  name = "giftCardTransactions21610720509376"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "FK_3ff5597f1d7e02bba41541846f4"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "FK_d7d441b81012f87d4265fa57d24"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "gcuniq"`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "gift_card_transaction"."gift_card_id" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "REL_3ff5597f1d7e02bba41541846f"`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "gift_card_transaction"."order_id" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" DROP CONSTRAINT "REL_d7d441b81012f87d4265fa57d2"`
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
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "REL_d7d441b81012f87d4265fa57d2" UNIQUE ("order_id")`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "gift_card_transaction"."order_id" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "REL_3ff5597f1d7e02bba41541846f" UNIQUE ("gift_card_id")`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "gift_card_transaction"."gift_card_id" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "gcuniq" UNIQUE ("gift_card_id", "order_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "FK_d7d441b81012f87d4265fa57d24" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card_transaction" ADD CONSTRAINT "FK_3ff5597f1d7e02bba41541846f4" FOREIGN KEY ("gift_card_id") REFERENCES "gift_card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
