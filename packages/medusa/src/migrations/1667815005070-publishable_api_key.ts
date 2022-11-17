import { MigrationInterface, QueryRunner } from "typeorm"

import PublishableAPIKeysFeatureFlag from "../loaders/feature-flags/publishable-api-keys"

export const featureFlag = PublishableAPIKeysFeatureFlag.key

export class publishableApiKey1667815005070 implements MigrationInterface {
  name = "publishableApiKey1667815005070"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publishable_api_key_sales_channel" ("sales_channel_id" character varying NOT NULL, "publishable_key_id" character varying NOT NULL, CONSTRAINT "PK_68eaeb14bdac8954460054c567c" PRIMARY KEY ("sales_channel_id", "publishable_key_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "publishable_api_key" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying, "revoked_by" character varying, "revoked_at" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, CONSTRAINT "PK_9e613278673a87de92c606b4494" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "publishable_api_key"`)
    await queryRunner.query(`DROP TABLE "publishable_api_key_sales_channel"`)
  }
}
