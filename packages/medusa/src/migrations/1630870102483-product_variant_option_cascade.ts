import {MigrationInterface, QueryRunner} from "typeorm";

export class productVariantOptionCascade1630870102483 implements MigrationInterface {
    name = 'productVariantOptionCascade1630870102483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_option_value" DROP CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01"`);
        await queryRunner.query(`ALTER TABLE "product_option_value" ADD CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE cascade ON UPDATE NO ACTION`);
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_option_value" DROP CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01"`);
        await queryRunner.query(`ALTER TABLE "product_option_value" ADD CONSTRAINT "FK_7234ed737ff4eb1b6ae6e6d7b01" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
