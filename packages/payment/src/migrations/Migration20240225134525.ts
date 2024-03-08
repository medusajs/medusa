import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class Migration20240225134525 extends Migration {
  async up(): Promise<void> {
    const paymentCollectionExists = await this.execute(
      `SELECT * FROM information_schema.tables where table_name = 'payment_collection' and table_schema = 'public';`
    )

    if (paymentCollectionExists.length) {
      this.addSql(`
        ${generatePostgresAlterColummnIfExistStatement(
          "payment_collection",
          ["type", "created_by"],
          "DROP NOT NULL"
        )}
        
        ALTER TABLE IF EXISTS "payment_collection" ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMPTZ NULL;
        ALTER TABLE IF EXISTS "payment_collection" ADD COLUMN IF NOT EXISTS "raw_amount" JSONB NOT NULL;
        ALTER TABLE IF EXISTS "payment_collection" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ NULL;
        ALTER TABLE "payment_collection" DROP CONSTRAINT "FK_payment_collection_region_id";
        
        ALTER TABLE IF EXISTS "payment_provider" ADD COLUMN IF NOT EXISTS "is_enabled" BOOLEAN NOT NULL DEFAULT TRUE;

        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "payment_collection_id" TEXT NOT NULL;
        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "currency_code" TEXT NOT NULL;
        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "authorized_at" TEXT NULL;
        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "payment_authorized_at" TIMESTAMPTZ NULL;
        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "raw_amount" JSONB NOT NULL;
        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ NULL;
        ALTER TABLE IF EXISTS "payment_session" ADD COLUMN IF NOT EXISTS "context" JSONB NULL;

        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ NULL;
        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "payment_collection_id" TEXT NOT NULL;
        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "provider_id" TEXT NOT NULL;
        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "raw_amount" JSONB NOT NULL;
        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ NULL;
        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "payment_session_id" TEXT NOT NULL;
        ALTER TABLE IF EXISTS "payment" ADD COLUMN IF NOT EXISTS "customer_id" TEXT NULL;

        ALTER TABLE IF EXISTS "refund" ADD COLUMN IF NOT EXISTS "raw_amount" JSONB NOT NULL;
        ALTER TABLE IF EXISTS "refund" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ NULL;
        ALTER TABLE IF EXISTS "refund" ADD COLUMN IF NOT EXISTS "created_by" TEXT NULL;
        ${generatePostgresAlterColummnIfExistStatement(
          "refund",
          ["reason"],
          "DROP NOT NULL"
        )}

        CREATE TABLE IF NOT EXISTS "capture" (
          "id"          TEXT NOT NULL,
          "amount"      NUMERIC NOT NULL,
          "raw_amount"  JSONB NOT NULL,
          "payment_id"  TEXT NOT NULL,
          "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"  TIMESTAMPTZ NULL,
          "created_by"  TEXT NULL,
          "metadata"    JSONB NULL,
          CONSTRAINT "capture_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE IF NOT EXISTS "payment_method_token" (
          "id"                 TEXT NOT NULL,
          "provider_id"        TEXT NOT NULL,
          "data"               JSONB NULL,
          "name"               TEXT NOT NULL,
          "type_detail"        TEXT NULL,
          "description_detail" TEXT NULL,
          "metadata"           JSONB NULL,
          "created_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"         TIMESTAMPTZ NULL,
          CONSTRAINT "payment_method_token_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE IF NOT EXISTS "payment_collection_payment_providers" (
          "payment_collection_id" TEXT NOT NULL,
          "payment_provider_id"   TEXT NOT NULL,
          CONSTRAINT "payment_collection_payment_providers_pkey" PRIMARY KEY ("payment_collection_id", "payment_provider_id")
        );

        ALTER TABLE IF EXISTS "payment_collection_payment_providers" 
          ADD CONSTRAINT "payment_collection_payment_providers_payment_coll_aa276_foreign" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
        
        ALTER TABLE IF EXISTS "payment_collection_payment_providers" 
          ADD CONSTRAINT "payment_collection_payment_providers_payment_provider_id_foreign" FOREIGN KEY ("payment_provider_id") REFERENCES "payment_provider" ("id") ON UPDATE CASCADE ON DELETE CASCADE;      
        
        ALTER TABLE IF EXISTS "capture"
          ADD CONSTRAINT "capture_payment_id_foreign" FOREIGN KEY ("payment_id") REFERENCES "payment" ("id") ON UPDATE CASCADE ON DELETE CASCADE;  
        
        ALTER TABLE IF EXISTS "refund" 
          ADD CONSTRAINT "refund_payment_id_foreign" FOREIGN KEY ("payment_id") REFERENCES "payment" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

        CREATE INDEX IF NOT EXISTS "IDX_payment_deleted_at" ON "payment" ("deleted_at") WHERE "deleted_at" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_payment_collection_id" ON "payment" ("payment_collection_id") WHERE "deleted_at" IS NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_method_token_deleted_at" ON "payment_method_token" ("deleted_at") WHERE "deleted_at" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_provider_id" ON "payment" ("provider_id") WHERE "deleted_at" IS NULL;
        
        CREATE INDEX IF NOT EXISTS "IDX_payment_collection_region_id" ON "payment_collection" ("region_id") WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_payment_collection_deleted_at" ON "payment_collection" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
        
        CREATE INDEX IF NOT EXISTS "IDX_refund_payment_id" ON "refund" ("payment_id") WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_refund_deleted_at" ON "payment" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
        
        CREATE INDEX IF NOT EXISTS "IDX_capture_payment_id" ON "capture" ("payment_id") WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_capture_deleted_at" ON "payment" ("deleted_at") WHERE "deleted_at" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_session_payment_collection_id" ON "payment_session" ("payment_collection_id") WHERE "deleted_at" IS NULL;

      `)
    } else {
      this.addSql(`
        CREATE TABLE IF NOT EXISTS "payment_collection" (
          "id"                TEXT NOT NULL,
          "currency_code"     TEXT NOT NULL,
          "amount"            NUMERIC NOT NULL,
          "raw_amount"        JSONB NOT NULL,
          "region_id"         TEXT NOT NULL,
          "created_at"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"        TIMESTAMPTZ NULL,
          "completed_at"      TIMESTAMPTZ NULL,
          "status"            TEXT CHECK ("status" IN ('not_paid', 'awaiting', 'authorized', 'partially_authorized', 'canceled')) NOT NULL DEFAULT 'not_paid',
          "metadata"           JSONB NULL,
          CONSTRAINT "payment_collection_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE IF NOT EXISTS "payment_method_token" (
          "id"                 TEXT NOT NULL,
          "provider_id"        TEXT NOT NULL,
          "data"               JSONB NULL,
          "name"               TEXT NOT NULL,
          "type_detail"        TEXT NULL,
          "description_detail" TEXT NULL,
          "metadata"           JSONB NULL,
          "created_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"         TIMESTAMPTZ NULL,
          CONSTRAINT "payment_method_token_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE IF NOT EXISTS "payment_provider" (
          "id"          TEXT NOT NULL,
          "is_enabled"  BOOLEAN NOT NULL DEFAULT TRUE,
          CONSTRAINT "payment_provider_pkey" PRIMARY KEY ("id")
        );
  
        CREATE TABLE IF NOT EXISTS "payment_collection_payment_providers" (
          "payment_collection_id" TEXT NOT NULL,
          "payment_provider_id"   TEXT NOT NULL,
          CONSTRAINT "payment_collection_payment_providers_pkey" PRIMARY KEY ("payment_collection_id", "payment_provider_id")
        );
      
        CREATE TABLE IF NOT EXISTS "payment_session" (
          "id"                   TEXT NOT NULL,
          "currency_code"        TEXT NOT NULL,
          "amount"               NUMERIC NOT NULL,
          "raw_amount"           JSONB NOT NULL,
          "provider_id"          TEXT NOT NULL,
          "data"                 JSONB NOT NULL,
          "context"              JSONB NULL,
          "status"               TEXT CHECK ("status" IN ('authorized', 'pending', 'requires_more', 'error', 'canceled')) NOT NULL DEFAULT 'pending',
          "authorized_at"        TIMESTAMPTZ NULL,
          "payment_collection_id" TEXT NOT NULL,
          "metadata"             JSONB NULL,
          "created_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"         TIMESTAMPTZ NULL,
          CONSTRAINT "payment_session_pkey" PRIMARY KEY ("id")
        );
  
        CREATE TABLE IF NOT EXISTS "payment" (
          "id"                   TEXT NOT NULL,
          "amount"               NUMERIC NOT NULL,
          "raw_amount"           JSONB NOT NULL,
          "currency_code"        TEXT NOT NULL,
          "provider_id"          TEXT NOT NULL,
          "cart_id"              TEXT NULL,
          "order_id"             TEXT NULL,
          "customer_id"          TEXT NULL,
          "data"                 JSONB NULL,
          "created_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"           TIMESTAMPTZ NULL,
          "captured_at"          TIMESTAMPTZ NULL,
          "canceled_at"          TIMESTAMPTZ NULL,
          "payment_collection_id" TEXT NOT NULL,
          "payment_session_id"   TEXT NOT NULL,
          "metadata"             JSONB NULL,
          CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
        );
  
        CREATE TABLE IF NOT EXISTS "refund" (
          "id"          TEXT NOT NULL,
          "amount"      NUMERIC NOT NULL,
          "raw_amount"      JSONB NOT NULL,
          "payment_id"  TEXT NOT NULL,
          "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"  TIMESTAMPTZ NULL,
          "created_by"  TEXT NULL,
          "metadata"    JSONB NULL,
          CONSTRAINT "refund_pkey" PRIMARY KEY ("id")
        );

        CREATE TABLE IF NOT EXISTS "capture" (
          "id"          TEXT NOT NULL,
          "amount"      NUMERIC NOT NULL,
          "raw_amount"  JSONB NOT NULL,
          "payment_id"  TEXT NOT NULL,
          "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "deleted_at"  TIMESTAMPTZ NULL,
          "created_by"  TEXT NULL,
          "metadata"    JSONB NULL,
          CONSTRAINT "capture_pkey" PRIMARY KEY ("id")
        );

        CREATE INDEX IF NOT EXISTS "IDX_payment_deleted_at" ON "payment" ("deleted_at") WHERE "deleted_at" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_payment_collection_id" ON "payment" ("payment_collection_id") WHERE "deleted_at" IS NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_method_token_deleted_at" ON "payment_method_token" ("deleted_at") WHERE "deleted_at" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_provider_id" ON "payment" ("provider_id") WHERE "deleted_at" IS NULL;
        
        CREATE INDEX IF NOT EXISTS "IDX_payment_collection_region_id" ON "payment_collection" ("region_id") WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_payment_collection_deleted_at" ON "payment_collection" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
        
        CREATE INDEX IF NOT EXISTS "IDX_refund_payment_id" ON "refund" ("payment_id") WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_refund_deleted_at" ON "payment" ("deleted_at") WHERE "deleted_at" IS NOT NULL;
        
        CREATE INDEX IF NOT EXISTS "IDX_capture_payment_id" ON "capture" ("payment_id") WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "IDX_capture_deleted_at" ON "payment" ("deleted_at") WHERE "deleted_at" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "IDX_payment_session_payment_collection_id" ON "payment_session" ("payment_collection_id") WHERE "deleted_at" IS NULL;

        ALTER TABLE IF EXISTS "payment_collection_payment_providers" 
          ADD CONSTRAINT "payment_collection_payment_providers_payment_coll_aa276_foreign" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
        
        ALTER TABLE IF EXISTS "payment_collection_payment_providers" 
          ADD CONSTRAINT "payment_collection_payment_providers_payment_provider_id_foreign" FOREIGN KEY ("payment_provider_id") REFERENCES "payment_provider" ("id") ON UPDATE CASCADE ON DELETE CASCADE;      
        
        ALTER TABLE IF EXISTS "payment_session" 
          ADD CONSTRAINT "payment_session_payment_collection_id_foreign" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
        
        ALTER TABLE IF EXISTS "payment" 
          ADD CONSTRAINT "payment_payment_collection_id_foreign" FOREIGN KEY ("payment_collection_id") REFERENCES "payment_collection" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
      
        ALTER TABLE IF EXISTS "capture" 
          ADD CONSTRAINT "capture_payment_id_foreign" FOREIGN KEY ("payment_id") REFERENCES "payment" ("id") ON UPDATE CASCADE ON DELETE CASCADE;  
        
        ALTER TABLE IF EXISTS "refund" 
          ADD CONSTRAINT "refund_payment_id_foreign" FOREIGN KEY ("payment_id") REFERENCES "payment" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
      `)
    }
  }
}
