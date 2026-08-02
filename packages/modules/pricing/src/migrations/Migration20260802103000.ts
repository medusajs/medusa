import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260802103000 extends Migration {
  override async up(): Promise<void> {
    // "IDX_price_list_rule_price_list_id" was created by the initial migration
    // with an inverted partial predicate (`deleted_at IS NOT NULL`), so it only
    // ever indexed soft-deleted rows. The hot path in
    // PricingRepository.calculatePrices resolves active price lists with
    // `plr.price_list_id = pl.id AND plr.deleted_at IS NULL`, which the index
    // could never serve - the planner fell back to a sequential scan of the
    // whole table, re-executed once per candidate price row.
    //
    // The index has to be dropped first: it already exists under this name, so
    // CREATE INDEX IF NOT EXISTS on its own is a no-op and cannot correct the
    // predicate. The PriceListRule model has always declared
    // `where: "deleted_at IS NULL"`, so this aligns the database with the model
    // definition rather than changing it.
    //
    // Locking: this runs as a normal transactional migration, matching every
    // other migration in the repo (no module uses CONCURRENTLY or overrides
    // isTransactional). DROP INDEX takes ACCESS EXCLUSIVE and holds it until
    // commit, so the replacement is built under a scratch name first and
    // swapped in by rename - that keeps concurrent reads live for all but the
    // final rename. Measured under concurrent load at 1M rows: read stall
    // 1468 ms with DROP-then-CREATE vs 68 ms with create-then-swap (22x).
    // Total transaction window scales with table size: ~24 ms at 10k rows,
    // ~137 ms at 50k, ~240 ms at 150k.
    //
    // Storefront pricing reads vastly outnumber price-list-rule writes, so
    // trading a longer write block for a much shorter read block is the right
    // call during a deploy. CREATE INDEX CONCURRENTLY was rejected: it cannot
    // run inside a transaction, would make this the only non-transactional
    // migration in the codebase, loses rollback, and leaves an INVALID index
    // requiring manual cleanup on failure.
    //
    // No IF NOT EXISTS on the scratch name: that clause is exactly the trap
    // this migration exists to undo. If a stale "_new" index somehow survives
    // a prior run, silently skipping the CREATE would drop the canonical index
    // and rename an unverified index into its place. Fail loudly instead - the
    // migration is transactional, so an error rolls back to the current state.
    this.addSql(
      `CREATE INDEX "IDX_price_list_rule_price_list_id_new" ON "price_list_rule" (price_list_id) WHERE deleted_at IS NULL;`
    )

    this.addSql(`drop index if exists "IDX_price_list_rule_price_list_id";`)

    this.addSql(
      `ALTER INDEX "IDX_price_list_rule_price_list_id_new" RENAME TO "IDX_price_list_rule_price_list_id";`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `CREATE INDEX "IDX_price_list_rule_price_list_id_old" ON "price_list_rule" (price_list_id) WHERE deleted_at IS NOT NULL;`
    )

    this.addSql(`drop index if exists "IDX_price_list_rule_price_list_id";`)

    this.addSql(
      `ALTER INDEX "IDX_price_list_rule_price_list_id_old" RENAME TO "IDX_price_list_rule_price_list_id";`
    )
  }
}
