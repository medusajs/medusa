import { MigrationInterface, QueryRunner } from "typeorm"

export class extendedBatchJob1657267320181 implements MigrationInterface {
  name = "extendedBatchJob1657267320181"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // check if batch job table exists and status column exists
    // if that's the case, the previous migration has already been run
    const batchJobColumnStatusExists = await queryRunner.query(`
      SELECT exists (
        SELECT FROM information_schema.columns
        WHERE  table_name = 'batch_job'
        AND    column_name   = 'status'
      )`)

    // if the table exists, we alter the table to add the new columns
    if (batchJobColumnStatusExists[0].exists) {
      await queryRunner.query(`
        ALTER TABLE "batch_job" DROP COLUMN "status";
        DROP TYPE "batch_job_status_enum";
        ALTER TABLE "batch_job" ADD "dry_run" boolean NOT NULL DEFAULT false;
        ALTER TABLE "batch_job" ADD "pre_processed_at" TIMESTAMP WITH TIME ZONE;
        ALTER TABLE "batch_job" ADD "processing_at" TIMESTAMP WITH TIME ZONE;
        ALTER TABLE "batch_job" ADD "confirmed_at" TIMESTAMP WITH TIME ZONE;
        ALTER TABLE "batch_job" ADD "completed_at" TIMESTAMP WITH TIME ZONE;
        ALTER TABLE "batch_job" ADD "canceled_at" TIMESTAMP WITH TIME ZONE;
        ALTER TABLE "batch_job" ADD "failed_at" TIMESTAMP WITH TIME ZONE;
        ALTER TABLE "batch_job" DROP COLUMN "created_by";
        ALTER TABLE "batch_job" ADD "created_by" character varying;
        ALTER TABLE "batch_job" ADD CONSTRAINT "FK_cdf30493ba1c9ef207e1e80c10a" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    void 0
  }
}
