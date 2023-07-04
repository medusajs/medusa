import {MigrationInterface, QueryRunner} from "typeorm";

export class addDiscountableToProduct1627995307200 implements MigrationInterface {
    name = 'addDiscountableToProduct1627995307200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "discountable" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discountable"`);
    }

}
