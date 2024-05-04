import { MigrationInterface, QueryRunner } from "typeorm"

export class productSearchGinIndexes1679950645254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        
        CREATE INDEX IF NOT EXISTS idx_gin_product_title ON product USING gin (title gin_trgm_ops) WHERE deleted_at is null;
        CREATE INDEX IF NOT EXISTS idx_gin_product_description ON product USING gin (description gin_trgm_ops) WHERE deleted_at is null;
        
        CREATE INDEX IF NOT EXISTS idx_gin_product_variant_title ON product_variant USING gin (title gin_trgm_ops) WHERE deleted_at is null;
        CREATE INDEX IF NOT EXISTS idx_gin_product_variant_sku ON product_variant USING gin (sku gin_trgm_ops) WHERE deleted_at is null;
        
        CREATE INDEX IF NOT EXISTS idx_gin_product_collection ON product_collection USING gin (title gin_trgm_ops) WHERE deleted_at is null;
      `)
    } catch (e) {
      // noop
      // The extension might not be installed, in that case do nothing except warn
      console.warn("Could not create pg_trgm extension or indexes, skipping. If you want to use the pg_trgm extension, please install it manually and then run the migration productSearchGinIndexes1679950645254.")
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_gin_product_title;
      DROP INDEX IF EXISTS idx_gin_product_description;
      DROP INDEX IF EXISTS idx_gin_product_variant_title;
      DROP INDEX IF EXISTS idx_gin_product_variant_sku;
      DROP INDEX IF EXISTS idx_gin_product_collection;
    `)
  }
}
