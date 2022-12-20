import { MigrationInterface, QueryRunner } from "typeorm"

export class claims1612284947120 implements MigrationInterface {
  name = "claims1612284947120"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shipping_method" DROP CONSTRAINT "CHK_3c00b878c1426d119cd70aa065"`
    )
    await queryRunner.query(
      `CREATE TABLE "claim_image" ("id" character varying NOT NULL, "claim_item_id" character varying NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_7c49e44bfe8840ca7d917890101" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "claim_tag" ("id" character varying NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_7761180541142a5926501018d34" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ec10c54769877840c132260e4a" ON "claim_tag" ("value") `
    )
    await queryRunner.query(
      `CREATE TYPE "claim_item_reason_enum" AS ENUM('missing_item', 'wrong_item', 'production_failure', 'other')`
    )
    await queryRunner.query(
      `CREATE TABLE "claim_item" ("id" character varying NOT NULL, "claim_order_id" character varying NOT NULL, "item_id" character varying NOT NULL, "variant_id" character varying NOT NULL, "reason" "claim_item_reason_enum" NOT NULL, "note" character varying, "quantity" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_5679662039bc4c7c6bc7fa1be2d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_900a9c3834257304396b2b0fe7" ON "claim_item" ("claim_order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6e0cad0daef76bb642675910b9" ON "claim_item" ("item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_64980511ca32c8e92b417644af" ON "claim_item" ("variant_id") `
    )
    await queryRunner.query(
      `CREATE TYPE "claim_order_payment_status_enum" AS ENUM('na', 'not_refunded', 'refunded')`
    )
    await queryRunner.query(
      `CREATE TYPE "claim_order_fulfillment_status_enum" AS ENUM('not_fulfilled', 'partially_fulfilled', 'fulfilled', 'partially_shipped', 'shipped', 'partially_returned', 'returned', 'canceled', 'requires_action')`
    )
    await queryRunner.query(
      `CREATE TYPE "claim_order_type_enum" AS ENUM('refund', 'replace')`
    )
    await queryRunner.query(
      `CREATE TABLE "claim_order" ("id" character varying NOT NULL, "payment_status" "claim_order_payment_status_enum" NOT NULL DEFAULT 'na', "fulfillment_status" "claim_order_fulfillment_status_enum" NOT NULL DEFAULT 'not_fulfilled', "type" "claim_order_type_enum" NOT NULL, "order_id" character varying NOT NULL, "shipping_address_id" character varying, "refund_amount" integer, "canceled_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, "idempotency_key" character varying, CONSTRAINT "PK_8981f5595a4424021466aa4c7a4" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "claim_item_tags" ("item_id" character varying NOT NULL, "tag_id" character varying NOT NULL, CONSTRAINT "PK_54ab8ce0f7e99167068188fbd81" PRIMARY KEY ("item_id", "tag_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c2c0f3edf39515bd15432afe6e" ON "claim_item_tags" ("item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_dc9bbf9fcb9ba458d25d512811" ON "claim_item_tags" ("tag_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" ADD "claim_order_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ADD "claim_order_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ADD CONSTRAINT "UQ_71773d56eb2bacb922bc3283398" UNIQUE ("claim_order_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "fulfillment" ADD "claim_order_id" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "claim_order_id" character varying`
    )
    await queryRunner.query(
      `ALTER TYPE "refund_reason_enum" RENAME TO "refund_reason_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "refund_reason_enum" AS ENUM('discount', 'return', 'swap', 'claim', 'other')`
    )
    await queryRunner.query(
      `ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum" USING "reason"::"text"::"refund_reason_enum"`
    )
    await queryRunner.query(`DROP TYPE "refund_reason_enum_old"`)
    await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`)
    await queryRunner.query(
      `CREATE INDEX "IDX_d783a66d1c91c0858752c933e6" ON "shipping_method" ("claim_order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_118e3c48f09a7728f41023c94e" ON "line_item" ("claim_order_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" ADD CONSTRAINT "CHK_a7020b08665bbd64d84a6641cf" CHECK ("claim_order_id" IS NOT NULL OR "order_id" IS NOT NULL OR "cart_id" IS NOT NULL OR "swap_id" IS NOT NULL OR "return_id" IS NOT NULL)`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_image" ADD CONSTRAINT "FK_21cbfedd83d736d86f4c6f4ce56" FOREIGN KEY ("claim_item_id") REFERENCES "claim_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item" ADD CONSTRAINT "FK_900a9c3834257304396b2b0fe7c" FOREIGN KEY ("claim_order_id") REFERENCES "claim_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item" ADD CONSTRAINT "FK_6e0cad0daef76bb642675910b9d" FOREIGN KEY ("item_id") REFERENCES "line_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item" ADD CONSTRAINT "FK_64980511ca32c8e92b417644afa" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" ADD CONSTRAINT "FK_d783a66d1c91c0858752c933e68" FOREIGN KEY ("claim_order_id") REFERENCES "claim_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "return" ADD CONSTRAINT "FK_71773d56eb2bacb922bc3283398" FOREIGN KEY ("claim_order_id") REFERENCES "claim_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" ADD CONSTRAINT "FK_f49e3974465d3c3a33d449d3f31" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" ADD CONSTRAINT "FK_017d58bf8260c6e1a2588d258e2" FOREIGN KEY ("shipping_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "fulfillment" ADD CONSTRAINT "FK_d73e55964e0ff2db8f03807d52e" FOREIGN KEY ("claim_order_id") REFERENCES "claim_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD CONSTRAINT "FK_118e3c48f09a7728f41023c94ef" FOREIGN KEY ("claim_order_id") REFERENCES "claim_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item_tags" ADD CONSTRAINT "FK_c2c0f3edf39515bd15432afe6e5" FOREIGN KEY ("item_id") REFERENCES "claim_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item_tags" ADD CONSTRAINT "FK_dc9bbf9fcb9ba458d25d512811b" FOREIGN KEY ("tag_id") REFERENCES "claim_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "claim_item_tags" DROP CONSTRAINT "FK_dc9bbf9fcb9ba458d25d512811b"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item_tags" DROP CONSTRAINT "FK_c2c0f3edf39515bd15432afe6e5"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP CONSTRAINT "FK_118e3c48f09a7728f41023c94ef"`
    )
    await queryRunner.query(
      `ALTER TABLE "fulfillment" DROP CONSTRAINT "FK_d73e55964e0ff2db8f03807d52e"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" DROP CONSTRAINT "FK_017d58bf8260c6e1a2588d258e2"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_order" DROP CONSTRAINT "FK_f49e3974465d3c3a33d449d3f31"`
    )
    await queryRunner.query(
      `ALTER TABLE "return" DROP CONSTRAINT "FK_71773d56eb2bacb922bc3283398"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" DROP CONSTRAINT "FK_d783a66d1c91c0858752c933e68"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item" DROP CONSTRAINT "FK_64980511ca32c8e92b417644afa"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item" DROP CONSTRAINT "FK_6e0cad0daef76bb642675910b9d"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_item" DROP CONSTRAINT "FK_900a9c3834257304396b2b0fe7c"`
    )
    await queryRunner.query(
      `ALTER TABLE "claim_image" DROP CONSTRAINT "FK_21cbfedd83d736d86f4c6f4ce56"`
    )
    await queryRunner.query(
      `ALTER TABLE "shipping_method" DROP CONSTRAINT "CHK_a7020b08665bbd64d84a6641cf"`
    )
    await queryRunner.query(`DROP INDEX "IDX_118e3c48f09a7728f41023c94e"`)
    await queryRunner.query(`DROP INDEX "IDX_d783a66d1c91c0858752c933e6"`)
    await queryRunner.query(`COMMENT ON COLUMN "refund"."reason" IS NULL`)
    await queryRunner.query(
      `CREATE TYPE "refund_reason_enum_old" AS ENUM('discount', 'return', 'swap', 'other')`
    )
    await queryRunner.query(
      `ALTER TABLE "refund" ALTER COLUMN "reason" TYPE "refund_reason_enum_old" USING "reason"::"text"::"refund_reason_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "refund_reason_enum"`)
    await queryRunner.query(
      `ALTER TYPE "refund_reason_enum_old" RENAME TO  "refund_reason_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "claim_order_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "fulfillment" DROP COLUMN "claim_order_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "return" DROP CONSTRAINT "UQ_71773d56eb2bacb922bc3283398"`
    )
    await queryRunner.query(`ALTER TABLE "return" DROP COLUMN "claim_order_id"`)
    await queryRunner.query(
      `ALTER TABLE "shipping_method" DROP COLUMN "claim_order_id"`
    )
    await queryRunner.query(`DROP INDEX "IDX_dc9bbf9fcb9ba458d25d512811"`)
    await queryRunner.query(`DROP INDEX "IDX_c2c0f3edf39515bd15432afe6e"`)
    await queryRunner.query(`DROP TABLE "claim_item_tags"`)
    await queryRunner.query(`DROP TABLE "claim_order"`)
    await queryRunner.query(`DROP TYPE "claim_order_type_enum"`)
    await queryRunner.query(`DROP TYPE "claim_order_fulfillment_status_enum"`)
    await queryRunner.query(`DROP TYPE "claim_order_payment_status_enum"`)
    await queryRunner.query(`DROP INDEX "IDX_64980511ca32c8e92b417644af"`)
    await queryRunner.query(`DROP INDEX "IDX_6e0cad0daef76bb642675910b9"`)
    await queryRunner.query(`DROP INDEX "IDX_900a9c3834257304396b2b0fe7"`)
    await queryRunner.query(`DROP TABLE "claim_item"`)
    await queryRunner.query(`DROP TYPE "claim_item_reason_enum"`)
    await queryRunner.query(`DROP INDEX "IDX_ec10c54769877840c132260e4a"`)
    await queryRunner.query(`DROP TABLE "claim_tag"`)
    await queryRunner.query(`DROP TABLE "claim_image"`)
    await queryRunner.query(
      `ALTER TABLE "shipping_method" ADD CONSTRAINT "CHK_3c00b878c1426d119cd70aa065" CHECK (((order_id IS NOT NULL) OR (cart_id IS NOT NULL) OR (swap_id IS NOT NULL) OR (return_id IS NOT NULL)))`
    )
  }
}
