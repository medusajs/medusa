import { MigrationInterface, QueryRunner } from "typeorm"

export class OrderStatusIndex1706275649015 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE INDEX "IDX_order_status" ON "order" ("status") `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_order_status"`)
    }

}
