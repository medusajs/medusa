import {MigrationInterface, QueryRunner} from "typeorm";

export class RankColumnWithDefaultValue1631104895519 implements MigrationInterface {
    name = 'RankColumnWithDefaultValue1631104895519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "variant_rank" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product_option_value" DROP CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01"`);
        await queryRunner.query(`ALTER TABLE "product_option_value" ADD CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE cascade ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0"`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE cascade ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "variant_rank"`);
        await queryRunner.query(`ALTER TABLE "product_option_value" DROP CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01"`);
        await queryRunner.query(`ALTER TABLE "product_option_value" ADD CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0"`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
 
    }

}
