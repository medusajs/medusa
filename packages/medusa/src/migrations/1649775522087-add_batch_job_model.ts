import { MigrationInterface, QueryRunner } from "typeorm"

export class addBatchJobModel1649775522087 implements MigrationInterface {
  name = "addBatchJobModel1649775522087"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "batch_job_status_enum" AS ENUM('created', 'processing', 'awaiting_confirmation', 'completed')`
    )
    await queryRunner.query(
      `CREATE TABLE "batch_job" ("id" character varying NOT NULL, "type" text NOT NULL, "status" "public"."batch_job_status_enum" NOT NULL, "created_by" text, "context" jsonb, "result" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e57f84d485145d5be96bc6d871e" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "batch_job"`)
    await queryRunner.query(`DROP TYPE "batch_job_status_enum"`)
  }
}
