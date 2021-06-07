import {MigrationInterface, QueryRunner} from "typeorm";

export class draftOrderCompletedAt1623063141210 implements MigrationInterface {
    name = 'draftOrderCompletedAt1623063141210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "draft_order" ADD "completed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."draft_order_status_enum" RENAME TO "draft_order_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "draft_order_status_enum" AS ENUM('open', 'completed')`);
        await queryRunner.query(`ALTER TABLE "draft_order" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "draft_order" ALTER COLUMN "status" TYPE "draft_order_status_enum" USING "status"::"text"::"draft_order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "draft_order" ALTER COLUMN "status" SET DEFAULT 'open'`);
        await queryRunner.query(`DROP TYPE "draft_order_status_enum_old"`);
        await queryRunner.query(`COMMENT ON COLUMN "draft_order"."status" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "draft_order"."status" IS NULL`);
        await queryRunner.query(`CREATE TYPE "draft_order_status_enum_old" AS ENUM('open', 'awaiting', 'completed')`);
        await queryRunner.query(`ALTER TABLE "draft_order" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "draft_order" ALTER COLUMN "status" TYPE "draft_order_status_enum_old" USING "status"::"text"::"draft_order_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "draft_order" ALTER COLUMN "status" SET DEFAULT 'open'`);
        await queryRunner.query(`DROP TYPE "draft_order_status_enum"`);
        await queryRunner.query(`ALTER TYPE "draft_order_status_enum_old" RENAME TO  "draft_order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "draft_order" DROP COLUMN "completed_at"`);
    }

}
