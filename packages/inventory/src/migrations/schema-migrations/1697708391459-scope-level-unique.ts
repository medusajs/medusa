import { MigrationInterface, QueryRunner } from "typeorm"

export class ScopeLevelUnique1697708391459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "UQ_inventory_level_inventory_item_id_location_id"`
    )

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_inventory_level_inventory_item_id_location_id" ON "inventory_level" ("inventory_item_id", "location_id") WHERE deleted_at IS NULL;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_inventory_level_inventory_item_id_location_id" ON "inventory_level" ("inventory_item_id", "location_id");
    `)
  }
}
