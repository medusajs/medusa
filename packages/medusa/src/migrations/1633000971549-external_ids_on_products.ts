import { MigrationInterface, QueryRunner } from "typeorm"

export class externalIdsOnProducts1633000971549 implements MigrationInterface {
  name = "externalIdsOnProducts1633000971549"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "external_id" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "external_id"`)
  }
}
