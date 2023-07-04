import { MigrationInterface, QueryRunner } from "typeorm"

export class externalIdOrder1638952072999 implements MigrationInterface {
  name = "externalIdOrder1638952072999"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "external_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "external_id" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "external_id"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "external_id"`)
  }
}
