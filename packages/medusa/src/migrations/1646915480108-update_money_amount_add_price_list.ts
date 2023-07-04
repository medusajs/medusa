import { MigrationInterface, QueryRunner } from "typeorm";

export class updateMoneyAmountAddPriceList1646915480108 implements MigrationInterface {
    name = 'updateMoneyAmountAddPriceList1646915480108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "price_list_type_enum" AS ENUM('sale', 'override')`);
        await queryRunner.query(`CREATE TYPE "price_list_status_enum" AS ENUM('active', 'draft')`);
        await queryRunner.query(`CREATE TABLE "price_list" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "type" "price_list_type_enum" NOT NULL DEFAULT 'sale', "status" "price_list_status_enum" NOT NULL DEFAULT 'draft', "starts_at" TIMESTAMP WITH TIME ZONE, "ends_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_52ea7826468b1c889cb2c28df03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_list_customer_groups" ("price_list_id" character varying NOT NULL, "customer_group_id" character varying NOT NULL, CONSTRAINT "PK_1afcbe15cc8782dc80c05707df9" PRIMARY KEY ("price_list_id", "customer_group_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_52875734e9dd69064f0041f4d9" ON "price_list_customer_groups" ("price_list_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5516f550433c9b1c2630d787a" ON "price_list_customer_groups" ("customer_group_id") `);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "sale_amount"`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "min_quantity" integer`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "max_quantity" integer`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "price_list_id" character varying`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_f249976b079375499662eb80c40" FOREIGN KEY ("price_list_id") REFERENCES "price_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_list_customer_groups" ADD CONSTRAINT "FK_52875734e9dd69064f0041f4d92" FOREIGN KEY ("price_list_id") REFERENCES "price_list"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "price_list_customer_groups" ADD CONSTRAINT "FK_c5516f550433c9b1c2630d787a7" FOREIGN KEY ("customer_group_id") REFERENCES "customer_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price_list_customer_groups" DROP CONSTRAINT "FK_c5516f550433c9b1c2630d787a7"`);
        await queryRunner.query(`ALTER TABLE "price_list_customer_groups" DROP CONSTRAINT "FK_52875734e9dd69064f0041f4d92"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_f249976b079375499662eb80c40"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "price_list_id"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "max_quantity"`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP COLUMN "min_quantity"`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD "sale_amount" integer`);
        await queryRunner.query(`DROP INDEX "IDX_c5516f550433c9b1c2630d787a"`);
        await queryRunner.query(`DROP INDEX "IDX_52875734e9dd69064f0041f4d9"`);
        await queryRunner.query(`DROP TABLE "price_list_customer_groups"`);
        await queryRunner.query(`DROP TABLE "price_list"`);
        await queryRunner.query(`DROP TYPE "price_list_status_enum"`);
        await queryRunner.query(`DROP TYPE "price_list_type_enum"`);
    }

}
