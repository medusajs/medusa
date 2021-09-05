import {MigrationInterface, QueryRunner} from "typeorm";

export class moneyAmountProductVariantCascade1630870682705 implements MigrationInterface {
    name = 'moneyAmountProductVariantCascade1630870682705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0"`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE cascade ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "money_amount" DROP CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0"`);
        await queryRunner.query(`ALTER TABLE "money_amount" ADD CONSTRAINT "FK_17a06d728e4cfbc5bd2ddb70af0" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
