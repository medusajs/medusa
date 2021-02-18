import {MigrationInterface, QueryRunner} from "typeorm";

export class paymentLinkTemplate1613634008478 implements MigrationInterface {
    name = 'paymentLinkTemplate1613634008478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" ADD "payment_link_template" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "payment_link_template"`);
    }

}
