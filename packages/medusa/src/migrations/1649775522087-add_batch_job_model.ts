import { MigrationInterface, QueryRunner } from "typeorm"

export class addBatchJobModel1649775522087 implements MigrationInterface {
  name = "addBatchJobModel1649775522087"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "batch_job"
         (
             "id"                       character varying                NOT NULL,
             "type"                     text                             NOT NULL,
             "created_by"               character varying,
             "context"                  jsonb,
             "result"                   jsonb,
             "dry_run"                  boolean                          NOT NULL DEFAULT FALSE,
             "created_at"               TIMESTAMP WITH TIME ZONE         NOT NULL DEFAULT now(),
             "pre_processed_at"            TIMESTAMP WITH TIME ZONE,
             "confirmed_at"             TIMESTAMP WITH TIME ZONE,
             "processing_at"            TIMESTAMP WITH TIME ZONE,
             "completed_at"             TIMESTAMP WITH TIME ZONE,
             "failed_at"                TIMESTAMP WITH TIME ZONE,
             "canceled_at"              TIMESTAMP WITH TIME ZONE,
             "updated_at"               TIMESTAMP WITH TIME ZONE         NOT NULL DEFAULT now(),
             "deleted_at"               TIMESTAMP WITH TIME ZONE,
             CONSTRAINT "PK_e57f84d485145d5be96bc6d871e" PRIMARY KEY ("id")
         )`
    )

    await queryRunner.query(
      `ALTER TABLE "batch_job"
                ADD CONSTRAINT "FK_fa53ca4f5fd90605b532802a626" FOREIGN KEY ("created_by") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch_job"
                DROP CONSTRAINT "FK_fa53ca4f5fd90605b532802a626"`
    )
    await queryRunner.query(`DROP TABLE "batch_job"`)
  }
}
