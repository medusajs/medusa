import {MigrationInterface, QueryRunner} from "typeorm";

export class validDurationForDiscount1631696624528 implements MigrationInterface {
    name = 'validDurationForDiscount1631696624528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" ADD "valid_duration" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "valid_duration"`);
    }

}