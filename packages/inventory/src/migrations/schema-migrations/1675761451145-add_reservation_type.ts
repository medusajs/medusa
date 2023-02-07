import {MigrationInterface, QueryRunner} from "typeorm";

export class addReservationType1675761451145 implements MigrationInterface {
    name = "addReservationType1675761451145"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TYPE "reservation_item_type_enum" AS ENUM('internal', 'external')

          ALTER TABLE "reservation_item" ADD COLUMN "type" "reservation_item_type_enum" NOT NULL DEFAULT 'internal';
        `)
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "reservation_item" DROP COLUMN "type";
          DROP TYPE "reservation_item_type_enum";
        `)
      }

}
