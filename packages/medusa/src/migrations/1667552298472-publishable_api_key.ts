import { MigrationInterface, QueryRunner } from "typeorm"

import PublishableAPIKeysFeatureFlag from "../loaders/feature-flags/publishable-api-keys"

export const featureFlag = PublishableAPIKeysFeatureFlag.key

export class publishableApiKey1667552298472 implements MigrationInterface {
  name = "publishableApiKey1667552298472"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "publishable_api_key_sales_channel" ("sales_channel_id" character varying NOT NULL, "publishable_key_id" character varying NOT NULL, CONSTRAINT "PK_68eaeb14bdac8954460054c567c" PRIMARY KEY ("sales_channel_id", "publishable_key_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "publishable_api_key" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying, "revoked_by" character varying, "revoked_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9e613278673a87de92c606b4494" PRIMARY KEY ("id"))`
    )

    await queryRunner.query(
      `ALTER TABLE "publishable_api_key" ADD CONSTRAINT "FK_ff1b82944b1d321d88c6f17252d" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "publishable_api_key" ADD CONSTRAINT "FK_264380a0a99740fd4a0c6642d14" FOREIGN KEY ("revoked_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "publishable_api_key" DROP CONSTRAINT "FK_264380a0a99740fd4a0c6642d14"`
    )
    await queryRunner.query(
      `ALTER TABLE "publishable_api_key" DROP CONSTRAINT "FK_ff1b82944b1d321d88c6f17252d"`
    )

    await queryRunner.query(`DROP TABLE "publishable_api_key"`)
    await queryRunner.query(`DROP TABLE "publishable_api_key_sales_channel"`)
  }
}
