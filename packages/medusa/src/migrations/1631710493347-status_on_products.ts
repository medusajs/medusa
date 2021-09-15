import { MigrationInterface, QueryRunner } from "typeorm"

export class statusOnProducts1631710493347 implements MigrationInterface {
  name = "statusOnProducts1631710493347"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."product" ADD "status" character varying DEFAULT 'draft'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."product" DROP COLUMN "status"`
    )
  }
}
