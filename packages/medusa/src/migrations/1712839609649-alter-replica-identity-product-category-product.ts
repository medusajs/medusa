import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterReplicaIdentityProductCategoryProduct1712839609649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product_category_product REPLICA IDENTITY USING INDEX "IDX_upcp_product_id_product_category_id";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product_category_product REPLICA IDENTITY DEFAULT;
    `);
  }
}