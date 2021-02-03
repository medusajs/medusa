import { MigrationInterface, QueryRunner } from "typeorm"

export class productOptionProductId1612359285299 implements MigrationInterface {
  name = "productOptionProductId1612359285299"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_option" DROP CONSTRAINT "FK_e634fca34f6b594b87fdbee95f6"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_option" ALTER COLUMN "product_id" SET NOT NULL`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "product_option"."product_id" IS NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "product_option"."product_id" IS NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product_option" ALTER COLUMN "product_id" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "product_option" ADD CONSTRAINT "FK_e634fca34f6b594b87fdbee95f6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
