import {MigrationInterface, QueryRunner} from "typeorm";

export class refunds1607679685096 implements MigrationInterface {
    name = 'refunds1607679685096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "refund_reason_enum" AS ENUM('discount', 'other')`);
        await queryRunner.query(`CREATE TABLE "refund" ("id" character varying NOT NULL, "order_id" character varying NOT NULL, "currency_code" character varying NOT NULL, "amount" integer NOT NULL, "note" integer, "reason" "refund_reason_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metadata" jsonb, CONSTRAINT "PK_f1cefa2e60d99b206c46c1116e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "refund" ADD CONSTRAINT "FK_eec9d9af4ca098e19ea6b499eaa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refund" ADD CONSTRAINT "FK_9615fbcd1030024cc33893a1900" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refund" DROP CONSTRAINT "FK_9615fbcd1030024cc33893a1900"`);
        await queryRunner.query(`ALTER TABLE "refund" DROP CONSTRAINT "FK_eec9d9af4ca098e19ea6b499eaa"`);
        await queryRunner.query(`ALTER TABLE "discount" ALTER COLUMN "starts_at" SET DEFAULT '2020-12-11 10:01:41.084373'`);
        await queryRunner.query(`COMMENT ON COLUMN "discount"."starts_at" IS NULL`);
        await queryRunner.query(`DROP TABLE "refund"`);
        await queryRunner.query(`DROP TYPE "refund_reason_enum"`);
    }

}
