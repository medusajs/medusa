import { MigrationInterface, QueryRunner } from "typeorm"

export class returnReason1615891636559 implements MigrationInterface {
  name = "returnReason1615891636559"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "return_reason" ("id" character varying NOT NULL, "value" character varying NOT NULL, "label" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_95fd1172973165790903e65660a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_00605f9d662c06b81c1b60ce24" ON "return_reason" ("value") `
    )
    await queryRunner.query(
      `ALTER TABLE "return_item" ADD "reason_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "return_item" ADD "note" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "return_item" ADD CONSTRAINT "FK_d742532378a65022e7ceb328828" FOREIGN KEY ("reason_id") REFERENCES "return_reason"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "return_item" DROP CONSTRAINT "FK_d742532378a65022e7ceb328828"`
    )
    await queryRunner.query(`ALTER TABLE "return_item" DROP COLUMN "note"`)
    await queryRunner.query(`ALTER TABLE "return_item" DROP COLUMN "reason_id"`)
    await queryRunner.query(`DROP INDEX "IDX_00605f9d662c06b81c1b60ce24"`)
    await queryRunner.query(`DROP TABLE "return_reason"`)
  }
}
