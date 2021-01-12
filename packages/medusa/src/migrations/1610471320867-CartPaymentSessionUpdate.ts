import { MigrationInterface, QueryRunner } from "typeorm"

export class CartPaymentSessionUpdate1610471320867
  implements MigrationInterface {
  name = "CartPaymentSessionUpdate1610471320867"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_e078c18a7edd40accfaea4e01c8"`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" DROP COLUMN "payment_session_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "payment_session" ADD "is_selected" boolean`
    )
    await queryRunner.query(
      `ALTER TABLE "payment_session" ADD CONSTRAINT "OneSelected" UNIQUE ("cart_id", "is_selected")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_484c329f4783be4e18e5e2ff090"`
    )
    await queryRunner.query(
      `ALTER TABLE "payment_session" DROP CONSTRAINT "OneSelected"`
    )
    await queryRunner.query(
      `ALTER TABLE "payment_session" DROP COLUMN "is_selected"`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ADD "payment_session_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_e078c18a7edd40accfaea4e01c8" FOREIGN KEY ("payment_session_id") REFERENCES "payment_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
