import {MigrationInterface, QueryRunner} from "typeorm";

export class noNotification1623231564533 implements MigrationInterface {
    name = 'noNotification1623231564533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "return" ADD "no_notification" boolean`);
        await queryRunner.query(`ALTER TABLE "claim_order" ADD "no_notification" boolean`);
        await queryRunner.query(`ALTER TABLE "swap" ADD "no_notification" boolean`);
        await queryRunner.query(`ALTER TABLE "order" ADD "no_notification" boolean`);
        await queryRunner.query(`ALTER TABLE "draft_order" ADD "no_notification_order" boolean`);
        await queryRunner.query(`ALTER TABLE "fulfillment" ADD "no_notification" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fulfillment" DROP COLUMN "no_notification"`);
        await queryRunner.query(`ALTER TABLE "draft_order" DROP COLUMN "no_notification_order"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "no_notification"`);
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "no_notification"`);
        await queryRunner.query(`ALTER TABLE "claim_order" DROP COLUMN "no_notification"`);
        await queryRunner.query(`ALTER TABLE "return" DROP COLUMN "no_notification"`);
        
    }

}
