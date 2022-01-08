import { MigrationInterface, QueryRunner } from "typeorm"

export class addIsReturnLineItem1641218367310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "is_return" boolean NOT NULL DEFAULT false`
    )

    await queryRunner.query(
      `UPDATE "line_item" SET "is_return" = true WHERE "id" IN (SELECT "id" from "line_item" WHERE "metadata"->>'is_return_line' = 'true')`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "line_item" DROP COLUMN "is_return"`)
  }
}
