import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateReturnReasonIndex1692870898423
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_00605f9d662c06b81c1b60ce24";`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_return_reason_value" ON "return_reason" ("value") WHERE deleted_at IS NULL;`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_return_reason_value";`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_00605f9d662c06b81c1b60ce24" ON "return_reason" ("value") `
    )
  }
}
