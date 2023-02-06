import { MigrationInterface, QueryRunner } from "typeorm"

export class scMetadataAndReservationTypes1675694226918
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sales_channel" ADD "metadata"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sales_channel" DROP COLUMN "metadata"`
    )
  }
}
