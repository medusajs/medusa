import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class Migration20240227090331 extends Migration {
  async up(): Promise<void> {
    // Adjust tax_provider table
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_provider" ADD COLUMN IF NOT EXISTS "is_enabled" bool not null default true;`
    )

    this.addSql(
      `CREATE TABLE IF NOT EXISTS "tax_provider" ("id" text not null, "is_enabled" boolean not null default true, CONSTRAINT "tax_provider_pkey" PRIMARY KEY ("id"));`
    )

    // Create or update tax_region table
    this.addSql(
      `CREATE TABLE IF NOT EXISTS "tax_region" ("id" text not null, "provider_id" text null, "country_code" text not null, "province_code" text null, "parent_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "created_by" text null, "deleted_at" timestamptz null, CONSTRAINT "tax_region_pkey" PRIMARY KEY ("id"), CONSTRAINT "CK_tax_region_country_top_level" CHECK (parent_id IS NULL OR province_code IS NOT NULL), CONSTRAINT "CK_tax_region_provider_top_level" CHECK (parent_id IS NULL OR provider_id IS NULL));`
    )
    // Indexes for tax_region
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_region_parent_id" ON "tax_region" ("parent_id");`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_region_deleted_at" ON "tax_region" ("deleted_at") WHERE deleted_at IS NOT NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tax_region_unique_country_province" ON "tax_region" ("country_code", "province_code");`
    )

    // Old foreign key on region_id
    this.addSql(
      generatePostgresAlterColummnIfExistStatement(
        "tax_rate",
        ["region_id"],
        "DROP NOT NULL"
      )
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" DROP CONSTRAINT IF EXISTS "FK_b95a1e03b051993d208366cb960";`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ADD COLUMN IF NOT EXISTS "tax_region_id" text not null;`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ADD COLUMN IF NOT EXISTS "deleted_at" timestamptz null;`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ADD COLUMN IF NOT EXISTS "created_by" text null;`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ADD COLUMN IF NOT EXISTS "is_default" bool not null default false;`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "tax_rate" ADD COLUMN IF NOT EXISTS "is_combinable" bool not null default false;`
    )
    this.addSql(
      `create table if not exists "tax_rate" ("id" text not null, "rate" real null, "code" text null, "name" text not null, "is_default" bool not null default false, "is_combinable" bool not null default false, "tax_region_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "created_by" text null, "deleted_at" timestamptz null, constraint "tax_rate_pkey" primary key ("id"));`
    )

    // Indexes for tax_rate
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_rate_tax_region_id" ON "tax_rate" ("tax_region_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_rate_deleted_at" ON "tax_rate" ("deleted_at") WHERE deleted_at IS NOT NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_single_default_region" ON "tax_rate" ("tax_region_id") WHERE is_default = true AND deleted_at IS NULL;`
    )

    // Adjust or create tax_rate_rule table
    this.addSql(
      `CREATE TABLE IF NOT EXISTS "tax_rate_rule" ("id" text not null, "tax_rate_id" text not null, "reference_id" text not null, "reference" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "created_by" text null, "deleted_at" timestamptz null, CONSTRAINT "tax_rate_rule_pkey" PRIMARY KEY ("id"));`
    )
    // Indexes for tax_rate_rule
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_rate_rule_tax_rate_id" ON "tax_rate_rule" ("tax_rate_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_rate_rule_reference_id" ON "tax_rate_rule" ("reference_id") WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_tax_rate_rule_deleted_at" ON "tax_rate_rule" ("deleted_at") WHERE deleted_at IS NOT NULL;`
    )
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tax_rate_rule_unique_rate_reference" ON "tax_rate_rule" ("tax_rate_id", "reference_id") WHERE deleted_at IS NULL;`
    )

    // Foreign keys adjustments
    this.addSql(
      `ALTER TABLE "tax_region" ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY ("provider_id") REFERENCES "tax_provider" ("id") ON DELETE SET NULL;`
    )
    this.addSql(
      `ALTER TABLE "tax_region" ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY ("parent_id") REFERENCES "tax_region" ("id") ON DELETE CASCADE;`
    )
    this.addSql(
      `ALTER TABLE "tax_rate" ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY ("tax_region_id") REFERENCES "tax_region" ("id") ON DELETE CASCADE;`
    )
    this.addSql(
      `ALTER TABLE "tax_rate_rule" ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY ("tax_rate_id") REFERENCES "tax_rate" ("id") ON DELETE CASCADE;`
    )

    // remove old tax related foreign key constraints
    this.addSql(
      `ALTER TABLE IF EXISTS "product_tax_rate" DROP CONSTRAINT IF EXISTS "FK_346e0016cf045b9980747747645";`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "product_type_tax_rate" DROP CONSTRAINT IF EXISTS "FK_ece65a774192b34253abc4cd672";`
    )
    this.addSql(
      `ALTER TABLE IF EXISTS "shipping_tax_rate" DROP CONSTRAINT IF EXISTS "FK_346e0016cf045b9980747747645";`
    )
  }
}
