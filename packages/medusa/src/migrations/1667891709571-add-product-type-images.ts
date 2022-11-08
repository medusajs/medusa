import { MigrationInterface, QueryRunner } from "typeorm"

export class addProductTypeImages1667891709571 implements MigrationInterface {
  name = "addProductTypeImages1667891709571"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_type" ADD "thumbnail" character varying`
    )
    await queryRunner.query(
      `CREATE TABLE "product_type_images" ("product_type_id" character varying NOT NULL, "image_id" character varying NOT NULL, CONSTRAINT "PK_10de97980da4f939r4c0e8443f1" PRIMARY KEY ("product_type_id", "image_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4f166sb8c2bf3ef2498d92b406" ON "product_type_images" ("product_type_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2212525ba406c79f42c47a99df" ON "product_type_images" ("image_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_images" ADD CONSTRAINT "FK_4f166bb8c3bscec2496d97b4091" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_images" ADD CONSTRAINT "FK_2212515bh301c78f42c26a99db2" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_type" DROP COLUMN "thumbnail"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_images" DROP CONSTRAINT "PK_10de97980da4f939r4c0e8443f1"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_images" DROP CONSTRAINT "FK_4f166bb8c3bscec2496d97b4091"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_images" DROP CONSTRAINT "FK_2212515bh301c78f42c26a99db2"`
    )
    await queryRunner.query(`DROP INDEX "IDX_4f166sb8c2bf3ef2498d92b406"`)
    await queryRunner.query(`DROP INDEX "IDX_2212525ba406c79f42c47a99df"`)
    await queryRunner.query(`DROP TABLE "product_type_images"`)
  }
}
