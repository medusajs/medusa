import { MigrationInterface, QueryRunner } from "typeorm"

export class stagedJobOptions1673003729870 implements MigrationInterface {
  name = "stagedJobOptions1673003729870"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staged_job" ADD "options" jsonb NOT NULL DEFAULT '{}'::JSONB`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staged_job" DROP COLUMN "options"`)
  }
}
