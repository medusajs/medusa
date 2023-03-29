import {MigrationInterface, QueryRunner} from "typeorm";

export class discountLimitPerCustomer1680006409536 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "discount" ADD "usage_limit_per_customer" integer DEFAULT '0'`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discount" DROP COLUMN "usage_limit_per_customer"`)
    }

}
