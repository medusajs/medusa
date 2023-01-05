import { MigrationInterface, QueryRunner } from "typeorm"

export class category1672906846559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "category"
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
          CONSTRAINT "PK_qgguwbn1cwstxk53efl0px9oqwt" PRIMARY KEY ("id")
        )
    `)

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b0dhljrfjktg1e98cnub69n502" ON "category" ("handle") WHERE deleted_at IS NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_b0dhljrfjktg1e98cnub69n502"`)
    await queryRunner.query(`DROP TABLE "category"`)
  }
}
