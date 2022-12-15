import { MigrationInterface, QueryRunner } from "typeorm"

import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"

export const featureFlag = OrderEditingFeatureFlag.key

export class paymentCollection1669032280563 implements MigrationInterface {
  name = "paymentCollection1669032280563"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "UniqPaymentSessionCartIdProviderId"
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "UniqPaymentSessionCartIdProviderId" ON "payment_session" ("cart_id", "provider_id") WHERE "cart_id" IS NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "UniqPaymentSessionCartIdProviderId"
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "UniqPaymentSessionCartIdProviderId" ON "payment_session" ("cart_id", "provider_id")`)
  }
}
