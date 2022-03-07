import {MigrationInterface, QueryRunner} from "typeorm";

export class extendMoneyAmount1646235066674 implements MigrationInterface {
    name = 'extendMoneyAmount1646235066674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "money_amount_customer_groups" ("money_amount_id" character varying NOT NULL, "customer_group_id" character varying NOT NULL, CONSTRAINT "PK_5229d422df27937dd3477d9d934" PRIMARY KEY ("money_amount_id", "customer_group_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_06bcf557e7e31c827a8ffbaabc" ON "money_amount_customer_groups" ("money_amount_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2fa82c3634965fd61df110ab30" ON "money_amount_customer_groups" ("customer_group_id") `);
        await queryRunner.query(`CREATE TYPE "public"."money_amount_type_enum" AS ENUM('default', 'sale', 'cost')`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "type" "public"."money_amount_type_enum" NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "starts_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "ends_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "min_quantity" integer`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "max_quantity" integer`);
        
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "sale_amount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "money_amount_customer_groups" DROP CONSTRAINT "FK_2fa82c3634965fd61df110ab309"`);
        await queryRunner.query(`ALTER TABLE "money_amount_customer_groups" DROP CONSTRAINT "FK_06bcf557e7e31c827a8ffbaabce"`);

        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "max_quantity"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "min_quantity"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "ends_at"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "starts_at"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."money_amount_type_enum"`);
        
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "sale_amount" integer`);
        await queryRunner.query(`DROP TABLE "money_amount_customer_groups"`);
    }

}
