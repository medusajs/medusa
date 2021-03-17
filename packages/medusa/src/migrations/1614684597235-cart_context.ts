import { MigrationInterface, QueryRunner } from "typeorm"

export class cartContext1614684597235 implements MigrationInterface {
  name = "cartContext1614684597235"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart" ADD "context" jsonb`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "context"`)
  }
}
