import { MigrationInterface, QueryRunner } from "typeorm"

export class addReservationType1675761451145 implements MigrationInterface {
  name = "addReservationType1675761451145"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "reservation_item" ADD "external_id" character varying
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "reservation_item" DROP COLUMN "external_id";
      `)
  }
}
