import { MigrationInterface, QueryRunner } from "typeorm"

export class ensureCancellationFieldsExist1625560513367
  implements MigrationInterface {
  name = "ensureCancellationFieldsExist1625560513367"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "swap" ADD "canceled_at" TIMESTAMP WITH TIME ZONE`
    )
    await queryRunner.query(
      `ALTER TYPE "return_status_enum" RENAME TO "return_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "return_status_enum" AS ENUM('requested', 'received', 'requires_action', 'canceled')`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ALTER COLUMN "status" TYPE "return_status_enum" USING "status"::"text"::"return_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ALTER COLUMN "status" SET DEFAULT 'requested'`
    )
    await queryRunner.query(`DROP TYPE "return_status_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "return_status_enum_old" AS ENUM('requested', 'received', 'requires_action')`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ALTER COLUMN "status" TYPE "return_status_enum_old" USING "status"::"text"::"return_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ALTER COLUMN "status" SET DEFAULT 'requested'`
    )
    await queryRunner.query(`DROP TYPE "return_status_enum"`)
    await queryRunner.query(
      `ALTER TYPE "return_status_enum_old" RENAME TO "return_status_enum"`
    )
    await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "canceled_at"`)
  }
}
