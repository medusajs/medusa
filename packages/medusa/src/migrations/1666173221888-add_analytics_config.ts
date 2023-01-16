import { MigrationInterface, QueryRunner } from "typeorm"
import AnalyticsFeatureFlag from "../loaders/feature-flags/analytics"

export const featureFlag = AnalyticsFeatureFlag.key

export class addAnalyticsConfig1666173221888 implements MigrationInterface {
  name = "addAnalyticsConfig1666173221888"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "analytics_config" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" character varying NOT NULL, "opt_out" boolean NOT NULL DEFAULT false, "anonymize" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_93505647c5d7cb479becb810b0f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_379ca70338ce9991f3affdeedf" ON "analytics_config" ("id", "user_id") WHERE deleted_at IS NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_379ca70338ce9991f3affdeedf"`
    )
    await queryRunner.query(`DROP TABLE "analytics_config"`)
  }
}
