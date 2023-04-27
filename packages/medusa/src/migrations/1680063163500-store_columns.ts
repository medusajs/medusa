import { MigrationInterface, QueryRunner } from "typeorm"

export class storeColumns1680063163500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE department ("id" character varying NOT NULL, 
    "user_id" character varying NOT NULL, "store_id" character varying NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE TABLE user_store_products ("id" character varying NOT NULL, 
    "user_id" character varying NOT NULL, "store_id" character varying NOT NULL, "product_id" character varying NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "department";
    `)
    
    await queryRunner.query(`
      DROP TABLE "user_store_products";
    `)
  }
}