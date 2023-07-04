import {MigrationInterface, QueryRunner} from "typeorm";

export class enforceUniqueness1631261634964 implements MigrationInterface {
    name = 'enforceUniqueness1631261634964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e08af711f3493df1e921c4c9ef"`);
        await queryRunner.query(`DROP INDEX "IDX_77c4073c30ea7793f484750529"`);
        await queryRunner.query(`DROP INDEX "IDX_0683952543d7d3f4fffc427034"`);
        await queryRunner.query(`DROP INDEX "IDX_410649600ce31c10c4b667ca10"`);
        await queryRunner.query(`DROP INDEX "IDX_5248fda27b9f16ef818604bb6f"`);
        await queryRunner.query(`DROP INDEX "IDX_832f86daf8103491d634a967da"`);
        await queryRunner.query(`DROP INDEX "IDX_ae3e22c67d7c7a969a363533c0"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6f234f058bbbea810dce1d04d0" ON "product_collection" ("handle") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cf9cc6c3f2e6414b992223fff1" ON "product" ("handle") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2ca8cfbdafb998ecfd6d340389" ON "product_variant" ("sku") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_045d4a149c09f4704e0bc08dd4" ON "product_variant" ("barcode") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b5b6225539ee8501082fbc0714" ON "product_variant" ("ean") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_aa16f61348be02dd07ce3fc54e" ON "product_variant" ("upc") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f65bf52e2239ace276ece2b2f4" ON "discount" ("code") WHERE deleted_at IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DROP INDEX "IDX_f65bf52e2239ace276ece2b2f4"`);
        await queryRunner.query(`DROP INDEX "IDX_aa16f61348be02dd07ce3fc54e"`);
        await queryRunner.query(`DROP INDEX "IDX_b5b6225539ee8501082fbc0714"`);
        await queryRunner.query(`DROP INDEX "IDX_045d4a149c09f4704e0bc08dd4"`);
        await queryRunner.query(`DROP INDEX "IDX_2ca8cfbdafb998ecfd6d340389"`);
        await queryRunner.query(`DROP INDEX "IDX_cf9cc6c3f2e6414b992223fff1"`);
        await queryRunner.query(`DROP INDEX "IDX_6f234f058bbbea810dce1d04d0"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae3e22c67d7c7a969a363533c0" ON "discount" ("code") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_832f86daf8103491d634a967da" ON "product_variant" ("upc") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5248fda27b9f16ef818604bb6f" ON "product_variant" ("ean") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_410649600ce31c10c4b667ca10" ON "product_variant" ("barcode") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0683952543d7d3f4fffc427034" ON "product_variant" ("sku") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_77c4073c30ea7793f484750529" ON "product" ("handle") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e08af711f3493df1e921c4c9ef" ON "product_collection" ("handle") WHERE (deleted_at IS NOT NULL)`);
    }

}
