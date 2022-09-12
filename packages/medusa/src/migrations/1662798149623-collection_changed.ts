import {MigrationInterface, QueryRunner} from "typeorm";

export class collectionChanged1662798149623 implements MigrationInterface {
    name = 'collectionChanged1662798149623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_49d419fc77d3aed46c835c558ac"`);
        await queryRunner.query(`CREATE TABLE "product_collections" ("product_id" character varying NOT NULL, "product_collection_id" character varying NOT NULL, CONSTRAINT "PK_c7f0a39bf6c0c737099774ceeee" PRIMARY KEY ("product_id", "product_collection_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c876fae7420b26100e0767e7ad" ON "product_collections" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c93088d186d83f0507a9c215d8" ON "product_collections" ("product_collection_id") `);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "collection_id"`);
        await queryRunner.query(`ALTER TABLE "product_collections" ADD CONSTRAINT "FK_c876fae7420b26100e0767e7ad1" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_collections" ADD CONSTRAINT "FK_c93088d186d83f0507a9c215d87" FOREIGN KEY ("product_collection_id") REFERENCES "product_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_collections" DROP CONSTRAINT "FK_c93088d186d83f0507a9c215d87"`);
        await queryRunner.query(`ALTER TABLE "product_collections" DROP CONSTRAINT "FK_c876fae7420b26100e0767e7ad1"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "collection_id" character varying`);
        await queryRunner.query(`DROP TABLE "product_collections"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_49d419fc77d3aed46c835c558ac" FOREIGN KEY ("collection_id") REFERENCES "product_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
