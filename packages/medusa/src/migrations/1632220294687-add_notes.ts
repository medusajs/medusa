import { MigrationInterface, QueryRunner } from "typeorm"

export class addNotes1632220294687 implements MigrationInterface {
  name = "addNotes1632220294687"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "note" ("id" character varying NOT NULL, "value" character varying NOT NULL, "resource_type" character varying NOT NULL, "resource_id" character varying NOT NULL, "author_id" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f74980b411cf94af523a72af7d" ON "note" ("resource_type") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3287f98befad26c3a7dab088cf" ON "note" ("resource_id") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_3287f98befad26c3a7dab088cf"`)
    await queryRunner.query(`DROP INDEX "IDX_f74980b411cf94af523a72af7d"`)
    await queryRunner.query(`DROP TABLE "note"`)
  }
}
