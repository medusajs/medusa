import { MigrationInterface, QueryRunner } from "typeorm"
import AnalyticsFeatureFlag from "../loaders/feature-flags/analytics"

export const featureFlag = AnalyticsFeatureFlag.key

export class addAnalyticsConfig1665660449659 implements MigrationInterface {
  name = "addAnalyticsConfig1665660449659"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "analytics_config" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" character varying NOT NULL, "opt_out" boolean NOT NULL DEFAULT false, "anonymize" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ab46f7f4004ed899d568982c06c" PRIMARY KEY ("id", "user_id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "analytics_config"`)
  }
}
