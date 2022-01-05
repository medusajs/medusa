import { MigrationInterface, QueryRunner } from "typeorm"

export class productTypeTax1641372305398 implements MigrationInterface {
  name = "productTypeTax1641372305398"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_type_tax_rate" ("product_type_id" character varying NOT NULL, "rate_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_ddc9242de1d99bc7674969289f0" PRIMARY KEY ("product_type_id", "rate_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_tax_rate" ADD CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111" FOREIGN KEY ("product_type_id") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_tax_rate" ADD CONSTRAINT "FK_ece65a774192b34253abc4cd672" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_type_tax_rate" DROP CONSTRAINT "FK_ece65a774192b34253abc4cd672"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_type_tax_rate" DROP CONSTRAINT "FK_25a3138bb236f63d9bb6c8ff111"`
    )
    await queryRunner.query(`DROP TABLE "product_type_tax_rate"`)
  }
}
