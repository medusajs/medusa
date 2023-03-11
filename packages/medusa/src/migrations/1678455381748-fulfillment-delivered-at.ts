import {MigrationInterface, QueryRunner} from "typeorm";

export class fulfillmentDeliveredAt1678455381748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "fulfillment" ADD "delivered_at" TIMESTAMP WITH TIME ZONE`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "fulfillment" DROP COLUMN "delivered_at"`
        )
    }

}
