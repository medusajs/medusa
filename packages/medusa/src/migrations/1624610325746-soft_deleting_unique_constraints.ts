import {MigrationInterface, QueryRunner} from "typeorm";

export class softDeletingUniqueConstraints1624610325746 implements MigrationInterface {
    name = 'softDeletingUniqueConstraints1624610325746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_6910923cb678fd6e99011a21cc"`);
        await queryRunner.query(`DROP INDEX "IDX_db7355f7bd36c547c8a4f539e5"`);
        await queryRunner.query(`DROP INDEX "IDX_087926f6fec32903be3c8eedfa"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e08af711f3493df1e921c4c9ef" ON "product_collection" ("handle") WHERE deleted_at IS NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_77c4073c30ea7793f484750529" ON "product" ("handle") WHERE deleted_at IS NOT NULL`);  
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae3e22c67d7c7a969a363533c0" ON "discount" ("code") WHERE deleted_at IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_ae3e22c67d7c7a969a363533c0"`);
        await queryRunner.query(`DROP INDEX "IDX_77c4073c30ea7793f484750529"`);
        await queryRunner.query(`DROP INDEX "IDX_e08af711f3493df1e921c4c9ef"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_087926f6fec32903be3c8eedfa" ON "discount" ("code") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_db7355f7bd36c547c8a4f539e5" ON "product" ("handle") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6910923cb678fd6e99011a21cc" ON "product_collection" ("handle") `);
    }

}
