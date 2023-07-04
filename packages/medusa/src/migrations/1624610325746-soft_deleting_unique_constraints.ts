import {MigrationInterface, QueryRunner} from "typeorm";

export class softDeletingUniqueConstraints1624610325746 implements MigrationInterface {
    name = 'softDeletingUniqueConstraints1624610325746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_6910923cb678fd6e99011a21cc"`);
        await queryRunner.query(`DROP INDEX "IDX_db7355f7bd36c547c8a4f539e5"`);
        await queryRunner.query(`DROP INDEX "IDX_087926f6fec32903be3c8eedfa"`);
        await queryRunner.query(`DROP INDEX "IDX_f4dc2c0888b66d547c175f090e"`);
        await queryRunner.query(`DROP INDEX "IDX_9db95c4b71f632fc93ecbc3d8b"`);
        await queryRunner.query(`DROP INDEX "IDX_7124082c8846a06a857cca386c"`);
        await queryRunner.query(`DROP INDEX "IDX_a0a3f124dc5b167622217fee02"`);
        
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e08af711f3493df1e921c4c9ef" ON "product_collection" ("handle") WHERE deleted_at IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_77c4073c30ea7793f484750529" ON "product" ("handle") WHERE deleted_at IS NOT NULL`);  
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae3e22c67d7c7a969a363533c0" ON "discount" ("code") WHERE deleted_at IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0683952543d7d3f4fffc427034" ON "product_variant" ("sku") WHERE deleted_at IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_410649600ce31c10c4b667ca10" ON "product_variant" ("barcode") WHERE deleted_at IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5248fda27b9f16ef818604bb6f" ON "product_variant" ("ean") WHERE deleted_at IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_832f86daf8103491d634a967da" ON "product_variant" ("upc") WHERE deleted_at IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_ae3e22c67d7c7a969a363533c0"`);
        await queryRunner.query(`DROP INDEX "IDX_77c4073c30ea7793f484750529"`);
        await queryRunner.query(`DROP INDEX "IDX_e08af711f3493df1e921c4c9ef"`);
        await queryRunner.query(`DROP INDEX "IDX_832f86daf8103491d634a967da"`);
        await queryRunner.query(`DROP INDEX "IDX_5248fda27b9f16ef818604bb6f"`);
        await queryRunner.query(`DROP INDEX "IDX_410649600ce31c10c4b667ca10"`);
        await queryRunner.query(`DROP INDEX "IDX_0683952543d7d3f4fffc427034"`);
        
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_087926f6fec32903be3c8eedfa" ON "discount" ("code") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_db7355f7bd36c547c8a4f539e5" ON "product" ("handle") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6910923cb678fd6e99011a21cc" ON "product_collection" ("handle") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a0a3f124dc5b167622217fee02" ON "product_variant" ("upc") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7124082c8846a06a857cca386c" ON "product_variant" ("ean") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9db95c4b71f632fc93ecbc3d8b" ON "product_variant" ("barcode") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f4dc2c0888b66d547c175f090e" ON "product_variant" ("sku") `);
    }

}
