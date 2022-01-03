import { MigrationInterface, QueryRunner } from "typeorm"

export class taxLines1639427769523 implements MigrationInterface {
  name = "taxLines1639427769523"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tax_rate" ("id" character varying NOT NULL, "rate" real, "code" character varying, "name" character varying NOT NULL, "region_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metadata" jsonb, CONSTRAINT "PK_23b71b53f650c0b39e99ccef4fd" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "tax_provider" ("id" character varying NOT NULL, "is_installed" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_b198bf82ba6a317c11763d99b99" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "line_item_tax_line" ("id" character varying NOT NULL, "rate" real NOT NULL, "name" character varying NOT NULL, "code" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metadata" jsonb, "item_id" character varying NOT NULL, CONSTRAINT "PK_4a0f4322fcd5ce4af85727f89a8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5077fa54b0d037e984385dfe8a" ON "line_item_tax_line" ("item_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "shipping_method_tax_line" ("id" character varying NOT NULL, "rate" real NOT NULL, "name" character varying NOT NULL, "code" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metadata" jsonb, "shipping_method_id" character varying NOT NULL, CONSTRAINT "PK_54c94f5908aacbd51cf0a73edb1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_926ca9f29014af8091722dede0" ON "shipping_method_tax_line" ("shipping_method_id") `
    )
    await queryRunner.query(
      `CREATE TABLE "product_tax_rate" ("product_id" character varying NOT NULL, "rate_id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_326257ce468df46cd5c8c5922e9" PRIMARY KEY ("product_id", "rate_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "gift_cards_taxable" boolean NOT NULL DEFAULT true`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "automatic_taxes" boolean NOT NULL DEFAULT true`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD "tax_provider_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "tax_rate" ADD CONSTRAINT "FK_b95a1e03b051993d208366cb960" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "region" ADD CONSTRAINT "FK_91f88052197680f9790272aaf5b" FOREIGN KEY ("tax_provider_id") REFERENCES "tax_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" ADD CONSTRAINT "FK_5077fa54b0d037e984385dfe8ad" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method_tax_line" ADD CONSTRAINT "FK_926ca9f29014af8091722dede08" FOREIGN KEY ("shipping_method_id") REFERENCES "shipping_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_tax_rate" ADD CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_tax_rate" ADD CONSTRAINT "FK_2484cf14c437a04586b07e7dddb" FOREIGN KEY ("rate_id") REFERENCES "tax_rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_tax_rate" DROP CONSTRAINT "FK_2484cf14c437a04586b07e7dddb"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_tax_rate" DROP CONSTRAINT "FK_1d04aebeabb6a89f87e536a124d"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method_tax_line" DROP CONSTRAINT "FK_926ca9f29014af8091722dede08"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item_tax_line" DROP CONSTRAINT "FK_5077fa54b0d037e984385dfe8ad"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP CONSTRAINT "FK_91f88052197680f9790272aaf5b"`
    )
    await queryRunner.query(
      `ALTER TABLE "tax_rate" DROP CONSTRAINT "FK_b95a1e03b051993d208366cb960"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "tax_provider_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "automatic_taxes"`
    )
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "giftcards_taxable"`
    )
    await queryRunner.query(`DROP TABLE "product_tax_rate"`)
    await queryRunner.query(`DROP INDEX "IDX_926ca9f29014af8091722dede0"`)
    await queryRunner.query(`DROP TABLE "shipping_method_tax_line"`)
    await queryRunner.query(`DROP INDEX "IDX_5077fa54b0d037e984385dfe8a"`)
    await queryRunner.query(`DROP TABLE "line_item_tax_line"`)
    await queryRunner.query(`DROP TABLE "tax_provider"`)
    await queryRunner.query(`DROP TABLE "tax_rate"`)
  }
}
