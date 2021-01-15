import { MigrationInterface, QueryRunner } from "typeorm"

export class giftcardOrderId1610706533465 implements MigrationInterface {
  name = "giftcardOrderId1610706533465"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card" ADD "order_id" character varying NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card" ADD CONSTRAINT "UQ_dfc1f02bb0552e79076aa58dbb0" UNIQUE ("order_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card" ADD CONSTRAINT "FK_dfc1f02bb0552e79076aa58dbb0" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_card" DROP CONSTRAINT "FK_dfc1f02bb0552e79076aa58dbb0"`
    )
    await queryRunner.query(
      `ALTER TABLE "gift_card" DROP CONSTRAINT "UQ_dfc1f02bb0552e79076aa58dbb0"`
    )
    await queryRunner.query(`ALTER TABLE "gift_card" DROP COLUMN "order_id"`)
  }
}
