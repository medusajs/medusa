import { MigrationInterface, QueryRunner } from "typeorm"

export class shippingTaxes1639855378309 implements MigrationInterface {
  name = "shippingTaxes1639855378309"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shipping_tax_rate" ("shipping_option_id" character varying NOT NULL, "rate_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_bcd93b14d7e2695365d383f5eae" PRIMARY KEY ("shipping_option_id", "rate_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_tax_rate" ADD CONSTRAINT "FK_f672727ab020df6c50fb64c1a70" FOREIGN KEY ("shipping_option_id") REFERENCES "shipping_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_tax_rate" ADD CONSTRAINT "FK_346e0016cf045b9980747747645" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_tax_rate" DROP CONSTRAINT "FK_346e0016cf045b9980747747645"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_tax_rate" DROP CONSTRAINT "FK_f672727ab020df6c50fb64c1a70"`
    )
    await queryRunner.query(`DROP TABLE "shipping_tax_rate"`)
  }
}
