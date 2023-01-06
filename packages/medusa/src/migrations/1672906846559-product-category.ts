import { MigrationInterface, QueryRunner } from "typeorm"

export class productCategory1672906846559 implements MigrationInterface {
  name = "productCategory1672906846559"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_category"
        (
          "id" character varying NOT NULL,
          "name" text NOT NULL,
          "handle" text NOT NULL,
          "parent_category_id" character varying,
          "mpath" text,
          "is_active" boolean DEFAULT false,
          "is_internal" boolean DEFAULT false,
          "deleted_at" TIMESTAMP WITH TIME ZONE,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          CONSTRAINT "PK_qgguwbn1cwstxk93efl0px9oqwt" PRIMARY KEY ("id")
        )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_product_category_handle" ON "product_category" ("handle") WHERE deleted_at IS NULL`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_product_category_path" ON "product_category" ("mpath")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_product_category_path"`)
    await queryRunner.query(`DROP INDEX "IDX_product_category_handle"`)
    await queryRunner.query(`DROP TABLE "product_category"`)
  }
}
