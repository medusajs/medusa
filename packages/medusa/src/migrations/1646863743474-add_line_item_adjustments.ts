import {MigrationInterface, QueryRunner} from "typeorm";

export class addLineItemAdjustments1646863743474 implements MigrationInterface {
    name = 'addLineItemAdjustments1646863743474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "line_item_adjustment" ("id" character varying NOT NULL, "item_id" character varying NOT NULL, "description" character varying NOT NULL, "resource_id" character varying, "amount" integer NOT NULL, "metadata" jsonb, CONSTRAINT "PK_2b1360103753df2dc8257c2c8c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be9aea2ccf3567007b6227da4d" ON "line_item_adjustment" ("item_id") `);
        await queryRunner.query(`ALTER TABLE "line_item_adjustment" ADD CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_item_adjustment" DROP CONSTRAINT "FK_be9aea2ccf3567007b6227da4d2"`);
        await queryRunner.query(`DROP INDEX "IDX_be9aea2ccf3567007b6227da4d"`);
        await queryRunner.query(`DROP TABLE "line_item_adjustment"`);
    }

}
