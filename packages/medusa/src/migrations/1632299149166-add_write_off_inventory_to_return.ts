import { MigrationInterface, QueryRunner } from "typeorm"

export class addWriteOffInventoryToReturn1632299149166
  implements MigrationInterface {
  name = "addWriteOffInventoryToReturn1632299149166"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return" ADD "write_off_inventory" boolean NOT NULL DEFAULT true`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return" DROP COLUMN "write_off_inventory"`
    )
  }
}
