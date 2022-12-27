import { MigrationInterface, QueryRunner } from "typeorm"

export class multiLocation1666251508718 implements MigrationInterface {
  name = "multiLocation1666251508718"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sales_channel_location" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sales_channel_id" text NOT NULL, "location_id" text NOT NULL, CONSTRAINT "PK_afd2c2c52634bc8280a9c9ee533" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6caaa358f12ed0b846f00e2dcd" ON "sales_channel_location" ("sales_channel_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c2203162ca946a71aeb98390b0" ON "sales_channel_location" ("location_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "return" ADD "location_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "store" ADD "default_location_id" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store" DROP COLUMN "default_location_id"`
    )
    await queryRunner.query(`ALTER TABLE "return" DROP COLUMN "location_id"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c2203162ca946a71aeb98390b0"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6caaa358f12ed0b846f00e2dcd"`
    )
    await queryRunner.query(`DROP TABLE "sales_channel_location"`)
  }
}
