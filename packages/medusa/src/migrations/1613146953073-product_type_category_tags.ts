import { MigrationInterface, QueryRunner } from "typeorm"

export class productTypeCategoryTags1613146953073
  implements MigrationInterface {
  name = "productTypeCategoryTags1613146953073"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_collection" ("id" character varying NOT NULL, "title" character varying NOT NULL, "handle" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_49d419fc77d3aed46c835c558ac" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6910923cb678fd6e99011a21cc" ON "product_collection" ("handle") `
    )
    await queryRunner.query(
      `CREATE TABLE "product_tag" ("id" character varying NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_1439455c6528caa94fcc8564fda" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "product_type" ("id" character varying NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_e0843930fbb8854fe36ca39dae1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "product_tags" ("product_id" character varying NOT NULL, "product_tag_id" character varying NOT NULL, CONSTRAINT "PK_1cf5c9537e7198df494b71b993f" PRIMARY KEY ("product_id", "product_tag_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5b0c6fc53c574299ecc7f9ee22" ON "product_tags" ("product_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_21683a063fe82dafdf681ecc9c" ON "product_tags" ("product_tag_id") `
    )
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "tags"`)
    await queryRunner.query(
      `ALTER TABLE "product" ADD "collection_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "type_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_49d419fc77d3aed46c835c558ac" FOREIGN KEY ("collection_id") REFERENCES "product_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_tags" ADD CONSTRAINT "FK_5b0c6fc53c574299ecc7f9ee22e" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_tags" ADD CONSTRAINT "FK_21683a063fe82dafdf681ecc9c4" FOREIGN KEY ("product_tag_id") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_e0843930fbb8854fe36ca39dae1" FOREIGN KEY ("type_id") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_tags" DROP CONSTRAINT "FK_21683a063fe82dafdf681ecc9c4"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_tags" DROP CONSTRAINT "FK_5b0c6fc53c574299ecc7f9ee22e"`
    )
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_49d419fc77d3aed46c835c558ac"`
    )
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "type_id"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "collection_id"`)
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_e0843930fbb8854fe36ca39dae1"`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "tags" character varying`
    )
    await queryRunner.query(`DROP INDEX "IDX_21683a063fe82dafdf681ecc9c"`)
    await queryRunner.query(`DROP INDEX "IDX_5b0c6fc53c574299ecc7f9ee22"`)
    await queryRunner.query(`DROP TABLE "product_tags"`)
    await queryRunner.query(`DROP TABLE "product_type"`)
    await queryRunner.query(`DROP TABLE "product_tag"`)
    await queryRunner.query(`DROP INDEX "IDX_6910923cb678fd6e99011a21cc"`)
    await queryRunner.query(`DROP TABLE "product_collection"`)
  }
}
