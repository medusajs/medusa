import { MigrationInterface, QueryRunner } from "typeorm"

export class externalIdOnOrders1632411600937 implements MigrationInterface {
  name = "externalIdOnOrders1632411600937"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "external_id" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "external_id"`)
  }
}
