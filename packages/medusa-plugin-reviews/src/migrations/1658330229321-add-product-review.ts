import { MigrationInterface, QueryRunner } from "typeorm"

export class addProductReview1658330229321 implements MigrationInterface {
  name = "addProductReview1658330229321"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_review" ("id" SERIAL, "product_id" character varying NOT NULL, "rating" integer NOT NULL, "body" character varying, "email" character varying NOT NULL, "name" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f62d1a5c2c0c40729a944b8a52b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0c987a9dcec74ea199325ede4c" ON "product_review" ("email") `
    )
    await queryRunner.query(
      `ALTER TABLE "product_review" ADD CONSTRAINT "FK_3f182d2d13c74174867224f14b8" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_review" DROP CONSTRAINT "FK_3f182d2d13c74174867224f14b8"`
    )
    await queryRunner.query(`DROP INDEX "IDX_0c987a9dcec74ea199325ede4c"`)
    await queryRunner.query(`DROP TABLE "product_review"`)
  }
}
