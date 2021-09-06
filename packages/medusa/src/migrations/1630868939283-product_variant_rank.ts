import {MigrationInterface, QueryRunner} from "typeorm";

export class productVariantRank1630868939283 implements MigrationInterface {
    name = 'productVariantRank1630868939283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "variant_rank" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "variant_rank"`);
    }

}
