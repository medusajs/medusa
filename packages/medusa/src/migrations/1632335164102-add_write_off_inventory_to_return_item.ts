import { MigrationInterface, QueryRunner } from "typeorm"

export class addWriteOffInventoryToReturnItem1632335164102
  implements MigrationInterface {
  name = "addWriteOffInventoryToReturnItem1632335164102"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return_item" ADD "write_off_inventory" integer`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return_item" DROP COLUMN "write_off_inventory"`
    )
  }
}
