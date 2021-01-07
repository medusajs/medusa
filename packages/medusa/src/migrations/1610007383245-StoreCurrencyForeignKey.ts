import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCurrencyForeignKey1610007383245 implements MigrationInterface {
    name = 'StoreCurrencyForeignKey1610007383245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "FK_fbc70f44db752a5b3efc35aec77"`);
        await queryRunner.query(`DROP INDEX "IDX_fbc70f44db752a5b3efc35aec7"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" RENAME COLUMN "currency_id" TO "currency_code"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" RENAME CONSTRAINT "PK_549c487a3f14dfefb1053b32682" TO "PK_0f2bff3bccc785c320a4df836de"`);
        await queryRunner.query(`COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_82a6bbb0b527c20a0002ddcbd6" ON "store_currencies" ("currency_code") `);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "FK_82a6bbb0b527c20a0002ddcbd60" FOREIGN KEY ("currency_code") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_currencies" DROP CONSTRAINT "FK_82a6bbb0b527c20a0002ddcbd60"`);
        await queryRunner.query(`DROP INDEX "IDX_82a6bbb0b527c20a0002ddcbd6"`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "money_amount" ALTER COLUMN "sale_amount" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "money_amount"."sale_amount" IS NULL`);
        await queryRunner.query(`ALTER TABLE "store_currencies" RENAME CONSTRAINT "PK_0f2bff3bccc785c320a4df836de" TO "PK_549c487a3f14dfefb1053b32682"`);
        await queryRunner.query(`ALTER TABLE "store_currencies" RENAME COLUMN "currency_code" TO "currency_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_fbc70f44db752a5b3efc35aec7" ON "store_currencies" ("currency_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_723472e41cae44beb0763f4039" ON "currency" ("code") `);
        await queryRunner.query(`ALTER TABLE "store_currencies" ADD CONSTRAINT "FK_fbc70f44db752a5b3efc35aec77" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
