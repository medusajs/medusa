import { MigrationInterface, QueryRunner } from "typeorm"

export class indexes1612353094577 implements MigrationInterface {
  name = "indexes1612353094577"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_21cbfedd83d736d86f4c6f4ce5" ON "claim_image" ("claim_item_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7234ed737ff4eb1b6ae6e6d7b0" ON "product_option_value" ("variant_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b1aac8314662fa6b25569a575b" ON "country" ("region_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_012a62ba743e427b5ebe9dee18" ON "shipping_option_requirement" ("shipping_option_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5c58105f1752fca0f4ce69f466" ON "shipping_option" ("region_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c951439af4c98bf2bd7fb8726c" ON "shipping_option" ("profile_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a0e206bfaed3cb63c186091734" ON "shipping_option" ("provider_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_80823b7ae866dc5acae2dac6d2" ON "product" ("profile_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_17a06d728e4cfbc5bd2ddb70af" ON "money_amount" ("variant_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b433e27b7a83e6d12ab26b15b0" ON "money_amount" ("region_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ca67dd080aac5ecf99609960cd" ON "product_variant" ("product_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ac2c280de3701b2d66f6817f76" ON "discount" ("rule_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d25ba0787e1510ddc5d442ebcf" ON "payment_session" ("cart_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d18ad72f2fb7c87f075825b6f8" ON "payment_session" ("provider_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c17aff091441b7c25ec3d68d36" ON "payment" ("swap_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4665f17abc1e81dd58330e5854" ON "payment" ("cart_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f5221735ace059250daac9d980" ON "payment" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ea94f42b6c88e9191c3649d752" ON "payment" ("provider_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b6bcf8c3903097b84e85154eed" ON "gift_card" ("region_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_dfc1f02bb0552e79076aa58dbb" ON "gift_card" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6b9c66b5e36f7c827dfaa092f9" ON "cart" ("billing_address_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ced15a9a695d2b5db9dabce763" ON "cart" ("shipping_address_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_484c329f4783be4e18e5e2ff09" ON "cart" ("region_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_242205c81c1152fab1b6e84847" ON "cart" ("customer_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_9d1a161434c610aae7c3df2dc7" ON "cart" ("payment_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bad82d7bff2b08b87094bfac3d" ON "return" ("swap_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_71773d56eb2bacb922bc328339" ON "return" ("claim_order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d4bd17f918fc6c332b74a368c3" ON "return" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f49e3974465d3c3a33d449d3f3" ON "claim_order" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_017d58bf8260c6e1a2588d258e" ON "claim_order" ("shipping_address_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d73e55964e0ff2db8f03807d52" ON "fulfillment" ("claim_order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a52e234f729db789cf473297a5" ON "fulfillment" ("swap_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f129acc85e346a10eed12b86fc" ON "fulfillment" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_beb35a6de60a6c4f91d5ae57e4" ON "fulfillment" ("provider_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_52dd74e8c989aa5665ad2852b8" ON "swap" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d7d441b81012f87d4265fa57d2" ON "gift_card_transaction" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_eec9d9af4ca098e19ea6b499ea" ON "refund" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_579e01fb94f4f58db480857e05" ON "order" ("display_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c99a206eb11ad45f6b7f04f2dc" ON "order" ("cart_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_cd7812c96209c5bdd48a6b858b" ON "order" ("customer_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5568d3b9ce9f7abeeb37511ecf" ON "order" ("billing_address_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_19b0c6293443d1b464f604c331" ON "order" ("shipping_address_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e1fcce2b18dbcdbe0a5ba9a68b" ON "order" ("region_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8abe81b9aac151ae60bf507ad1" ON "customer" ("billing_address_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_9c9614b2f9d01665800ea8dbff" ON "address" ("customer_id") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_9c9614b2f9d01665800ea8dbff"`)
    await queryRunner.query(`DROP INDEX "IDX_8abe81b9aac151ae60bf507ad1"`)
    await queryRunner.query(`DROP INDEX "IDX_e1fcce2b18dbcdbe0a5ba9a68b"`)
    await queryRunner.query(`DROP INDEX "IDX_19b0c6293443d1b464f604c331"`)
    await queryRunner.query(`DROP INDEX "IDX_5568d3b9ce9f7abeeb37511ecf"`)
    await queryRunner.query(`DROP INDEX "IDX_cd7812c96209c5bdd48a6b858b"`)
    await queryRunner.query(`DROP INDEX "IDX_c99a206eb11ad45f6b7f04f2dc"`)
    await queryRunner.query(`DROP INDEX "IDX_579e01fb94f4f58db480857e05"`)
    await queryRunner.query(`DROP INDEX "IDX_eec9d9af4ca098e19ea6b499ea"`)
    await queryRunner.query(`DROP INDEX "IDX_d7d441b81012f87d4265fa57d2"`)
    await queryRunner.query(`DROP INDEX "IDX_52dd74e8c989aa5665ad2852b8"`)
    await queryRunner.query(`DROP INDEX "IDX_beb35a6de60a6c4f91d5ae57e4"`)
    await queryRunner.query(`DROP INDEX "IDX_f129acc85e346a10eed12b86fc"`)
    await queryRunner.query(`DROP INDEX "IDX_a52e234f729db789cf473297a5"`)
    await queryRunner.query(`DROP INDEX "IDX_d73e55964e0ff2db8f03807d52"`)
    await queryRunner.query(`DROP INDEX "IDX_017d58bf8260c6e1a2588d258e"`)
    await queryRunner.query(`DROP INDEX "IDX_f49e3974465d3c3a33d449d3f3"`)
    await queryRunner.query(`DROP INDEX "IDX_d4bd17f918fc6c332b74a368c3"`)
    await queryRunner.query(`DROP INDEX "IDX_71773d56eb2bacb922bc328339"`)
    await queryRunner.query(`DROP INDEX "IDX_bad82d7bff2b08b87094bfac3d"`)
    await queryRunner.query(`DROP INDEX "IDX_9d1a161434c610aae7c3df2dc7"`)
    await queryRunner.query(`DROP INDEX "IDX_242205c81c1152fab1b6e84847"`)
    await queryRunner.query(`DROP INDEX "IDX_484c329f4783be4e18e5e2ff09"`)
    await queryRunner.query(`DROP INDEX "IDX_ced15a9a695d2b5db9dabce763"`)
    await queryRunner.query(`DROP INDEX "IDX_6b9c66b5e36f7c827dfaa092f9"`)
    await queryRunner.query(`DROP INDEX "IDX_dfc1f02bb0552e79076aa58dbb"`)
    await queryRunner.query(`DROP INDEX "IDX_b6bcf8c3903097b84e85154eed"`)
    await queryRunner.query(`DROP INDEX "IDX_ea94f42b6c88e9191c3649d752"`)
    await queryRunner.query(`DROP INDEX "IDX_f5221735ace059250daac9d980"`)
    await queryRunner.query(`DROP INDEX "IDX_4665f17abc1e81dd58330e5854"`)
    await queryRunner.query(`DROP INDEX "IDX_c17aff091441b7c25ec3d68d36"`)
    await queryRunner.query(`DROP INDEX "IDX_d18ad72f2fb7c87f075825b6f8"`)
    await queryRunner.query(`DROP INDEX "IDX_d25ba0787e1510ddc5d442ebcf"`)
    await queryRunner.query(`DROP INDEX "IDX_ac2c280de3701b2d66f6817f76"`)
    await queryRunner.query(`DROP INDEX "IDX_ca67dd080aac5ecf99609960cd"`)
    await queryRunner.query(`DROP INDEX "IDX_b433e27b7a83e6d12ab26b15b0"`)
    await queryRunner.query(`DROP INDEX "IDX_17a06d728e4cfbc5bd2ddb70af"`)
    await queryRunner.query(`DROP INDEX "IDX_80823b7ae866dc5acae2dac6d2"`)
    await queryRunner.query(`DROP INDEX "IDX_a0e206bfaed3cb63c186091734"`)
    await queryRunner.query(`DROP INDEX "IDX_c951439af4c98bf2bd7fb8726c"`)
    await queryRunner.query(`DROP INDEX "IDX_5c58105f1752fca0f4ce69f466"`)
    await queryRunner.query(`DROP INDEX "IDX_012a62ba743e427b5ebe9dee18"`)
    await queryRunner.query(`DROP INDEX "IDX_b1aac8314662fa6b25569a575b"`)
    await queryRunner.query(`DROP INDEX "IDX_7234ed737ff4eb1b6ae6e6d7b0"`)
    await queryRunner.query(`DROP INDEX "IDX_21cbfedd83d736d86f4c6f4ce5"`)
  }
}
