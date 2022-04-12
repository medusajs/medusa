import { MigrationInterface, QueryRunner } from "typeorm"

export class addLineItemAdjustments1648600574750 implements MigrationInterface {
  name = "addLineItemAdjustments1648600574750"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "line_item_adjustment" ("id" character varying NOT NULL, "item_id" character varying NOT NULL, "description" character varying NOT NULL, "discount_id" character varying, "amount" integer NOT NULL, "metadata" jsonb, CONSTRAINT "PK_2b1360103753df2dc8257c2c8c3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_be9aea2ccf3567007b6227da4d" ON "line_item_adjustment" ("item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2f41b20a71f30e60471d7e3769" ON "line_item_adjustment" ("discount_id") `
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bf701b88d2041392a288785ada" ON "line_item_adjustment" ("discount_id", "item_id") WHERE "discount_id" IS NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_2f41b20a71f30e60471d7e3769c" FOREIGN KEY ("discount_id") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" DROP CONSTRAINT "FK_2f41b20a71f30e60471d7e3769c"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_adjustment" DROP CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2"`
    )
    await queryRunner.query(`DROP INDEX "IDX_bf701b88d2041392a288785ada"`)
    await queryRunner.query(`DROP INDEX "IDX_2f41b20a71f30e60471d7e3769"`)
    await queryRunner.query(`DROP INDEX "IDX_be9aea2ccf3567007b6227da4d"`)
    await queryRunner.query(`DROP TABLE "line_item_adjustment"`)
  }
}
