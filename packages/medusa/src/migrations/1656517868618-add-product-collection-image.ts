import { MigrationInterface, QueryRunner } from "typeorm"

export class addProductCollectionImage1656517868618
  implements MigrationInterface
{
  name = "addProductCollectionImage1656517868618"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_collection" ADD "thumbnail" character varying`
    )
    await queryRunner.query(
      `CREATE TABLE "product_collection_images" ("product_collection_id" character varying NOT NULL, "image_id" character varying NOT NULL, CONSTRAINT "PK_10de97980da2e939c4c0e8423f3" PRIMARY KEY ("product_collection_id", "image_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4f166bb8c2bfcef2498d97b407" ON "product_collection_images" ("product_collection_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2212515ba306c79f42c46a99de" ON "product_collection_images" ("image_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "product_collection_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4069" FOREIGN KEY ("product_collection_id") REFERENCES "product_collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_collection_images" ADD CONSTRAINT "FK_2212515ba306c79f42c46a99db8" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_collection" DROP COLUMN "thumbnail"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_collection_images" DROP CONSTRAINT "PK_10de97980da2e939c4c0e8423f3"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_collection_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4069"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_collection_images" DROP CONSTRAINT "FK_2212515ba306c79f42c46a99db8"`
    )
    await queryRunner.query(`DROP INDEX "IDX_4f166bb8c2bfcef2498d97b407"`)
    await queryRunner.query(`DROP INDEX "IDX_2212515ba306c79f42c46a99de"`)
    await queryRunner.query(`DROP TABLE "product_collection_images"`)
  }
}
