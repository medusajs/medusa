import { MigrationInterface, QueryRunner } from "typeorm"

export class lineItemAdjustmentsAmount1678093365812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE line_item_adjustment ALTER COLUMN amount TYPE NUMERIC;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE line_item_adjustment ALTER COLUMN amount TYPE integer;
    `)
  }
}
