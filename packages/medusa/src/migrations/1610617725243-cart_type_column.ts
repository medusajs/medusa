import { MigrationInterface, QueryRunner } from "typeorm";

export class cartTypeColumn1610617725243 implements MigrationInterface {
    name = 'cartTypeColumn1610617725243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "cart_type_enum" AS ENUM('default', 'swap', 'payment_link')`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "type" "cart_type_enum" NOT NULL DEFAULT 'default'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "cart_type_enum"`);
    }

}
