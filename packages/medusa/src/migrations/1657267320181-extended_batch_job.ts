import { MigrationInterface, QueryRunner } from "typeorm";

export class extendedBatchJob1657267320181 implements MigrationInterface {
    name = 'extendedBatchJob1657267320181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."batch_job_status_enum"`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "dry_run" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "pre_processed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "processing_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "confirmed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "completed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "canceled_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "failed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "created_by" character varying`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD CONSTRAINT "FK_cdf30493ba1c9ef207e1e80c10a" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_job" DROP CONSTRAINT "FK_cdf30493ba1c9ef207e1e80c10a"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "created_by"`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "created_by" text`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "failed_at"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "canceled_at"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "completed_at"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "confirmed_at"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "processing_at"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "pre_processed_at"`);
        await queryRunner.query(`ALTER TABLE "batch_job" DROP COLUMN "dry_run"`);
        await queryRunner.query(`CREATE TYPE "public"."batch_job_status_enum" AS ENUM('created', 'processing', 'awaiting_confirmation', 'completed')`);
        await queryRunner.query(`ALTER TABLE "batch_job" ADD "status" "public"."batch_job_status_enum" NOT NULL`);
    }

}
