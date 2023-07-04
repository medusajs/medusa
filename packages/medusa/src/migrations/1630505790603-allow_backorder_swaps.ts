import {MigrationInterface, QueryRunner} from "typeorm";

export class allowBackorderSwaps1630505790603 implements MigrationInterface {
    name = 'allowBackorderSwaps1630505790603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap" ADD "allow_backorder" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "payment_authorized_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TYPE "swap_payment_status_enum" RENAME TO "swap_payment_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "swap_payment_status_enum" AS ENUM('not_paid', 'awaiting', 'captured', 'confirmed', 'canceled', 'difference_refunded', 'partially_refunded', 'refunded', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "swap" ALTER COLUMN "payment_status" TYPE "swap_payment_status_enum" USING "payment_status"::"text"::"swap_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "swap_payment_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "swap_payment_status_enum_old" AS ENUM('not_paid', 'awaiting', 'captured', 'canceled', 'difference_refunded', 'partially_refunded', 'refunded', 'requires_action')`);
        await queryRunner.query(`ALTER TABLE "swap" ALTER COLUMN "payment_status" TYPE "swap_payment_status_enum_old" USING "payment_status"::"text"::"swap_payment_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "swap_payment_status_enum"`);
        await queryRunner.query(`ALTER TYPE "swap_payment_status_enum_old" RENAME TO  "swap_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "payment_authorized_at"`);
        await queryRunner.query(`ALTER TABLE "swap" DROP COLUMN "allow_backorder"`);
    }

}
