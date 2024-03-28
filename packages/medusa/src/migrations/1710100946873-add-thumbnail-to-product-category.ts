import { MigrationInterface, QueryRunner } from "typeorm"

export class AddThumbnailToProductCategory1710100946873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_category" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_category" DROP COLUMN IF EXISTS "thumbnail"`
        )
    }

}
