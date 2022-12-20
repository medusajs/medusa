import { MigrationInterface, QueryRunner } from "typeorm"

export class removedStagedJobs1671545490914 implements MigrationInterface {
  name = "removedStagedJobs1671545490914"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "staged_job"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "staged_job" ("id" character varying NOT NULL, "event_name" character varying NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "PK_9a28fb48c46c5509faf43ac8c8d" PRIMARY KEY ("id"))`
    )
  }
}
