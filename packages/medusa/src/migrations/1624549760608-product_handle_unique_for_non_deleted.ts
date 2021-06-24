import { MigrationInterface, QueryRunner } from "typeorm"

export class productHandleUniqueForNonDeleted1624549760608
  implements MigrationInterface {
  name = "productHandleUniqueForNonDeleted1624549760608"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_db7355f7bd36c547c8a4f539e5"`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_77c4073c30ea7793f484750529" ON "product" ("handle") WHERE deleted_at IS NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_77c4073c30ea7793f484750529"`)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_db7355f7bd36c547c8a4f539e5" ON "product" ("handle") `
    )
  }
}
