import { MigrationInterface, QueryRunner } from "typeorm"

export class returnReason1615882896077 implements MigrationInterface {
  name = "returnReason1615882896077"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "return_item_reason_enum" AS ENUM('too_small', 'too_big', 'not_as_expected', 'other')`
    )
    await queryRunner.query(
      `ALTER TABLE "return_item" ADD "reason" "return_item_reason_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "return_item" ADD "note" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "return_item" DROP COLUMN "note"`)
    await queryRunner.query(`ALTER TABLE "return_item" DROP COLUMN "reason"`)
    await queryRunner.query(`DROP TYPE "return_item_reason_enum"`)
  }
}
