import { MigrationInterface, QueryRunner } from "typeorm"

export class updateOrderCustomerAddressIndexes1699564794650
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner
      .query(
        `
      CREATE EXTENSION IF NOT EXISTS pg_trgm;

      CREATE INDEX IF NOT EXISTS idx_gin_order_email ON "order" USING gin (email gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_gin_order_display_id ON "order" USING gin (CAST(display_id as varchar) gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_gin_address_first_name ON address USING gin (first_name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_gin_address_last_name ON address USING gin (last_name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_gin_customer_phone ON customer USING gin (phone gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_gin_customer_first_name ON customer USING gin (first_name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_gin_customer_last_name ON customer USING gin (last_name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_address_delete_at ON "address" (deleted_at);
      CREATE INDEX IF NOT EXISTS idx_customer_delete_at ON "customer" (deleted_at);
      `
      )
      .catch((e) => {
        // noop
        // The extension might not be installed, in that case do nothing except warn
        console.warn(
          "Could not create pg_trgm extension or indexes, skipping. If you want to use the pg_trgm extension, please install it manually and then run the migration updateOrderCustomerAddressIndexes1699564794650.",
          e.message ?? ""
        )
      })

    /**
     * update existing indexes to use varchar instead of text. If there is a type difference between the index and the column it might not be used.
     */
    await queryRunner.query(`
      drop index if exists 
          IDX_579e01fb94f4f58db480857e05, /* display_id on order */
          IDX_cd7812c96209c5bdd48a6b858b, /* customer_id on order */
          IDX_19b0c6293443d1b464f604c331, /* shipping_address_id on order */
          uidx_address_id,
          uidx_customer_id,
          uidx_order_id,
          idx_order_shipping_address_id,
          idx_order_display_id,
          idx_order_customer_id;

      CREATE UNIQUE INDEX IF NOT EXISTS uidx_address_id ON address ((id::varchar)) WHERE deleted_at IS NULL;
      CREATE UNIQUE INDEX IF NOT EXISTS uidx_customer_id ON customer ((id::varchar)) WHERE deleted_at IS NULL;
      CREATE UNIQUE INDEX IF NOT EXISTS uidx_order_id ON "order" ((id::varchar));
      CREATE INDEX IF NOT EXISTS idx_order_shipping_address_id ON "order" ((shipping_address_id::varchar));
      CREATE INDEX IF NOT EXISTS idx_order_display_id ON "order" ((display_id::varchar));
      CREATE INDEX IF NOT EXISTS idx_order_customer_id ON "order" ((customer_id::varchar));
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          drop index if exists idx_gin_order_email,
                    idx_gin_order_display_id,
                    idx_gin_address_first_name,
                    idx_gin_address_last_name,
                    idx_gin_customer_phone,
                    idx_gin_customer_first_name,
                    idx_gin_customer_last_name;

          drop index if exists uidx_address_id,
                  uidx_customer_id,
                  uidx_order_id,
                  idx_order_shipping_address_id,
                  idx_order_display_id,
                  idx_order_customer_id,
                  idx_address_delete_at,
                  idx_customer_delete_at;

          CREATE INDEX "IDX_19b0c6293443d1b464f604c331" ON "order" ("shipping_address_id");
          CREATE INDEX "IDX_579e01fb94f4f58db480857e05" ON "order" ("display_id");
          CREATE INDEX "IDX_cd7812c96209c5bdd48a6b858b" ON "order" ("customer_id");
      `
    )
  }
}
