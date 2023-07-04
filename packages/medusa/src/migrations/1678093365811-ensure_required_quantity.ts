import { MigrationInterface, QueryRunner } from "typeorm"

export class ensureRequiredQuantity1678093365811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO
        $$
            BEGIN
                ALTER TABLE product_variant_inventory_item
                    RENAME COLUMN quantity TO required_quantity;
            EXCEPTION
                WHEN undefined_column THEN
            END;
        $$;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO
        $$
            BEGIN
                ALTER TABLE product_variant_inventory_item
                    RENAME COLUMN required_quantity TO quantity;
            EXCEPTION
                WHEN undefined_column THEN
            END;
        $$;
    `)
  }
}
