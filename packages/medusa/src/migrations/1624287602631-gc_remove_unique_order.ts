import { MigrationInterface, QueryRunner } from "typeorm"

export class gcRemoveUniqueOrder1624287602631 implements MigrationInterface {
  name = "gcRemoveUniqueOrder1624287602631"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gift_card" DROP CONSTRAINT "FK_dfc1f02bb0552e79076aa58dbb0"`)
    await queryRunner.query(`COMMENT ON COLUMN "gift_card"."order_id" IS NULL`)
    await queryRunner.query(`ALTER TABLE "gift_card" DROP CONSTRAINT "REL_dfc1f02bb0552e79076aa58dbb"`)
    await queryRunner.query(`ALTER TABLE "gift_card" ADD CONSTRAINT "FK_dfc1f02bb0552e79076aa58dbb0" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "gift_card" DROP CONSTRAINT "FK_dfc1f02bb0552e79076aa58dbb0"`)
    await queryRunner.query(`ALTER TABLE "gift_card" ADD CONSTRAINT "REL_dfc1f02bb0552e79076aa58dbb" UNIQUE ("order_id")`)
    await queryRunner.query(`COMMENT ON COLUMN "gift_card"."order_id" IS NULL`)
    await queryRunner.query(`ALTER TABLE "gift_card" ADD CONSTRAINT "FK_dfc1f02bb0552e79076aa58dbb0" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }
}
