import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCurrencyForeignKey1610006721992 implements MigrationInterface {
    name = 'StoreCurrencyForeignKey1610006721992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fulfillment" DROP CONSTRAINT "FK_a52e234f729db789cf473297a5c"`);
        await queryRunner.query(`ALTER TABLE "return_item" ADD "is_requested" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "return_item" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TABLE "line_item" ADD "has_shipping" boolean`);
        await queryRunner.query(`COMMENT ON COLUMN "fulfillment"."swap_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "fulfillment" DROP CONSTRAINT "REL_a52e234f729db789cf473297a5"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_717a141f96b76d794d409f38129"`);
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "FK_3bdd5896ec93be2f1c62a3309a5"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_e15811f81339e4bd8c440aebe1c"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f41553459a4b1491c9893ebc921"`);
        await queryRunner.query(`ALTER TABLE "refund" DROP CONSTRAINT "FK_9615fbcd1030024cc33893a1900"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_55beebaa09e947cccca554af222"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "FK_82a6bbb0b527c20a0002ddcbd60"`);
        await queryRunner.query(`COMMENT ON COLUMN "currency"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "currency" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "currency_id_seq"`);
        await queryRunner.query(`COMMENT ON COLUMN "currency"."code" IS NULL`);
        await queryRunner.query(`ALTER TABLE "currency" DROP CONSTRAINT "PK_c2f67b45f0628aa06e9aec8ee5f"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91" PRIMARY KEY ("id")`);
        await queryRunner.query(`COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "PK_0f2bff3bccc785c320a4df836de"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "PK_b4f4b63d1736689b7008980394c" PRIMARY KEY ("store_id")`);
        await queryRunner.query(`DROP INDEX "IDX_82a6bbb0b527c20a0002ddcbd6"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP COLUMN "currency_code"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD "currency_code" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "PK_b4f4b63d1736689b7008980394c"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "PK_0f2bff3bccc785c320a4df836de" PRIMARY KEY ("store_id", "currency_code")`);
        await queryRunner.query(`CREATE INDEX "IDX_82a6bbb0b527c20a0002ddcbd6" ON "store_currencies" ("currency_code") `);
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "FK_3bdd5896ec93be2f1c62a3309a5" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_e15811f81339e4bd8c440aebe1c" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f41553459a4b1491c9893ebc921" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refund" ADD CONSTRAINT "FK_9615fbcd1030024cc33893a1900" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_717a141f96b76d794d409f38129" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_55beebaa09e947cccca554af222" FOREIGN KEY ("default_currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "FK_82a6bbb0b527c20a0002ddcbd60" FOREIGN KEY ("currency_code") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "FK_82a6bbb0b527c20a0002ddcbd60"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_55beebaa09e947cccca554af222"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_717a141f96b76d794d409f38129"`);
        await queryRunner.query(`ALTER TABLE "refund" DROP CONSTRAINT "FK_9615fbcd1030024cc33893a1900"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f41553459a4b1491c9893ebc921"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_e15811f81339e4bd8c440aebe1c"`);
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "FK_3bdd5896ec93be2f1c62a3309a5"`);
        await queryRunner.query(`DROP INDEX "IDX_82a6bbb0b527c20a0002ddcbd6"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "PK_0f2bff3bccc785c320a4df836de"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "PK_b4f4b63d1736689b7008980394c" PRIMARY KEY ("store_id")`);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP COLUMN "currency_code"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD "currency_code" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_82a6bbb0b527c20a0002ddcbd6" ON "store_currencies" ("currency_code") `);
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "PK_b4f4b63d1736689b7008980394c"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "PK_0f2bff3bccc785c320a4df836de" PRIMARY KEY ("store_id", "currency_code")`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "currency" DROP CONSTRAINT "PK_3cda65c731a6264f0e444cc9b91"`);
        await queryRunner.query(`ALTER TABLE "currency" ADD CONSTRAINT "PK_c2f67b45f0628aa06e9aec8ee5f" PRIMARY KEY ("id", "code")`);
        await queryRunner.query(`COMMENT ON COLUMN "currency"."code" IS NULL`);
        await queryRunner.query(`CREATE SEQUENCE "currency_id_seq" OWNED BY "currency"."id"`);
        await queryRunner.query(`ALTER TABLE "currency" ALTER COLUMN "id" SET DEFAULT nextval('currency_id_seq')`);
        await queryRunner.query(`COMMENT ON COLUMN "currency"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "FK_82a6bbb0b527c20a0002ddcbd60" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_55beebaa09e947cccca554af222" FOREIGN KEY ("default_currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refund" ADD CONSTRAINT "FK_9615fbcd1030024cc33893a1900" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f41553459a4b1491c9893ebc921" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_e15811f81339e4bd8c440aebe1c" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "FK_3bdd5896ec93be2f1c62a3309a5" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_717a141f96b76d794d409f38129" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fulfillment" ADD CONSTRAINT "REL_a52e234f729db789cf473297a5" UNIQUE ("swap_id")`);
        await queryRunner.query(`COMMENT ON COLUMN "fulfillment"."swap_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "line_item" DROP COLUMN "has_shipping"`);
        await queryRunner.query(`ALTER TABLE "return_item" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "return_item" DROP COLUMN "is_requested"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_723472e41cae44beb0763f4039" ON "currency" ("code") `);
        await queryRunner.query(`ALTER TABLE "fulfillment" ADD CONSTRAINT "FK_a52e234f729db789cf473297a5c" FOREIGN KEY ("swap_id") REFERENCES "swap"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
