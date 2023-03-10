import { MigrationInterface, QueryRunner } from "typeorm"

export class lineItemAdjustmentsAmount1678093365812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE line_item_adjustment ALTER COLUMN amount TYPE BIGINT;
        ALTER TABLE line_item_adjustment ADD COLUMN multiplier_factor BIGINT;
        UPDATE line_item_adjustment SET multiplier_factor = 1;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE line_item_adjustment ALTER COLUMN amount TYPE integer;
        ALTER TABLE line_item_adjustment DROP COLUMN multiplier_factor;
    `)
  }
}
