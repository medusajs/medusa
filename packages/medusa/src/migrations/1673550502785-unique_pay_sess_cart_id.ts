import { MigrationInterface, QueryRunner } from "typeorm";

export class uniquePaySessCartId1673550502785 implements MigrationInterface {
    name = 'uniquePaySessCartId1673550502785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UniqPaymentSessionCartIdProviderId"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UniqPaymentSessionCartIdProviderId" ON "payment_session" ("cart_id", "provider_id") WHERE cart_id IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UniqPaymentSessionCartIdProviderId"`);   
        await queryRunner.query(`CREATE UNIQUE INDEX "UniqPaymentSessionCartIdProviderId" ON "payment_session" ("cart_id", "provider_id") `);
    }
}
