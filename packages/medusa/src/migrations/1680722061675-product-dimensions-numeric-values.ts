import { MigrationInterface, QueryRunner } from "typeorm"

export class productDimensionsNumericValues1680722061675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product ALTER COLUMN weight TYPE NUMERIC;
      ALTER TABLE product ALTER COLUMN length TYPE NUMERIC;
      ALTER TABLE product ALTER COLUMN height TYPE NUMERIC;
      ALTER TABLE product ALTER COLUMN width TYPE NUMERIC;
  `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product ALTER COLUMN weight TYPE INTEGER;
      ALTER TABLE product ALTER COLUMN length TYPE INTEGER;
      ALTER TABLE product ALTER COLUMN height TYPE INTEGER;
      ALTER TABLE product ALTER COLUMN width TYPE INTEGER;
    `)
  }
}
