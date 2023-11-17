import { MigrationInterface, QueryRunner } from "typeorm"

export class AddMetadataToProductCategory1699564794649 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_category" ADD COLUMN "metadata" jsonb NULL;`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_category" DROP COLUMN "metadata"`
        )
    }

}
