import { MigrationInterface, QueryRunner } from "typeorm"

export class itemDescriptionsAndThumbnail1682927363119
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE inventory_item 
          ADD "title" character varying,
          ADD "description" character varying,
          ADD "thumbnail" character varying;
      `)
    await queryRunner.query(`
        ALTER TABLE "reservation_item"           
          ADD "description" character varying,
          ADD "created_by" character varying;
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE inventory_item 
          DROP COLUMN "title", 
          DROP COLUMN "description", 
          DROP COLUMN "thumbnail";
      `)
    await queryRunner.query(`
        ALTER TABLE "reservation_item" 
          DROP COLUMN "description", 
          DROP COLUMN "created_by";
      `)
  }
}
