import { MigrationInterface, QueryRunner } from "typeorm"

export class customerGroups1644943746861 implements MigrationInterface {
  name = "customerGroups1644943746861"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customer_group" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_88e7da3ff7262d9e0a35aa3664e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c4c3a5225a7a1f0af782c40abc" ON "customer_group" ("name") WHERE deleted_at IS NULL`
    )
    await queryRunner.query(
      `CREATE TABLE "customer_group_customers" ("customer_group_id" character varying NOT NULL, "customer_id" character varying NOT NULL, CONSTRAINT "PK_e28a55e34ad1e2d3df9a0ac86d3" PRIMARY KEY ("customer_group_id", "customer_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_620330964db8d2999e67b0dbe3" ON "customer_group_customers" ("customer_group_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3c6412d076292f439269abe1a2" ON "customer_group_customers" ("customer_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "customer_group_customers" ADD CONSTRAINT "FK_620330964db8d2999e67b0dbe3e" FOREIGN KEY ("customer_group_id") REFERENCES "customer_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_group_customers" ADD CONSTRAINT "FK_3c6412d076292f439269abe1a23" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_group_customers" DROP CONSTRAINT "FK_3c6412d076292f439269abe1a23"`
    )
    await queryRunner.query(
      `ALTER TABLE "customer_group_customers" DROP CONSTRAINT "FK_620330964db8d2999e67b0dbe3e"`
    )

    await queryRunner.query(`DROP INDEX "IDX_3c6412d076292f439269abe1a2"`)
    await queryRunner.query(`DROP INDEX "IDX_620330964db8d2999e67b0dbe3"`)
    await queryRunner.query(`DROP TABLE "customer_group_customers"`)
    await queryRunner.query(`DROP INDEX "IDX_c4c3a5225a7a1f0af782c40abc"`)
    await queryRunner.query(`DROP TABLE "customer_group"`)
  }
}
