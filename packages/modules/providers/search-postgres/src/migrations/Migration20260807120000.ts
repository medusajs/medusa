import { Migration } from "@medusajs/framework/mikro-orm/migrations"

/**
 * Enables portable search extensions and creates the catalog table.
 *
 * Always enabled (native engine):
 * - `pg_trgm` — typo tolerance
 * - `unaccent` — accent-insensitive FTS
 * - `medusa_search_english` — unaccent-backed text search config
 *
 * Lakebase extensions (`lakebase_vector`, `lakebase_text`) are enabled in a
 * later migration via `CREATE EXTENSION ... CASCADE`.
 */
export class Migration20260807120000 extends Migration {
  override async up(): Promise<void> {
    // Extension creation needs privileges the app role may not have on managed
    // Postgres. Soft-fail so migrations still apply; the provider assumes these
    // extensions (and the text search config) exist at runtime.
    this.addSql(`
      DO $$
      BEGIN
        BEGIN
          CREATE EXTENSION IF NOT EXISTS pg_trgm;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'search-postgres: could not enable pg_trgm (%).', SQLERRM;
        END;
        BEGIN
          CREATE EXTENSION IF NOT EXISTS unaccent;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'search-postgres: could not enable unaccent (%).', SQLERRM;
        END;
        BEGIN
          IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'unaccent')
             AND NOT EXISTS (
               SELECT 1 FROM pg_ts_config WHERE cfgname = 'medusa_search_english'
             ) THEN
            CREATE TEXT SEARCH CONFIGURATION medusa_search_english (COPY = english);
            ALTER TEXT SEARCH CONFIGURATION medusa_search_english
              ALTER MAPPING FOR hword, hword_part, word
              WITH unaccent, english_stem;
          END IF;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'search-postgres: could not create medusa_search_english (%).', SQLERRM;
        END;
      END
      $$;
    `)

    this.addSql(`
      create table if not exists "search_postgres_index" (
        "name" text not null,
        "table_name" text not null,
        "schema_hash" text not null,
        "plan" jsonb not null,
        "document_count" integer not null default 0,
        "created_at" timestamptz not null default now(),
        "updated_at" timestamptz not null default now(),
        constraint "search_postgres_index_pkey" primary key ("name")
      );
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "search_postgres_index" cascade;`)
  }
}
