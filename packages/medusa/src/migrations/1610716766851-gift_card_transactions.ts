import { MigrationInterface, QueryRunner } from "typeorm"

export class giftCardTransactions1610716766851 implements MigrationInterface {
  name = "giftCardTransactions1610716766851"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gift_card_transaction" ("id" character varying NOT NULL, "gift_card_id" character varying NOT NULL, "order_id" character varying NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_3ff5597f1d7e02bba41541846f" UNIQUE ("gift_card_id"), CONSTRAINT "REL_d7d441b81012f87d4265fa57d2" UNIQUE ("order_id"), CONSTRAINT "PK_cfb5b4ba5447a507aef87d73fe7" PRIMARY KEY ("id"))`
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
    await queryRunner.query(`DROP TABLE "gift_card_transaction"`)
  }
}
