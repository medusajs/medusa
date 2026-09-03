/**
 * A step in bringing the physical indexes in line with the loaded definitions.
 *
 * Planned and executed separately, like link migrations, so `db:migrate` can
 * show what it's about to do. Every action is idempotent.
 */
export type SearchIndexMigrationAction =
  | {
      /** No version of this index has gone live yet. */
      action: "create"
      /** The name of the index to create. */
      index: string
      /** The physical index the new version is built under. */
      physical_name: string
      /** A hash of the definition the version is created from. */
      definition_hash: string
      /** The new version's number. */
      version: number
    }
  | {
      /** The definition changed; a new version is built alongside the active one. */
      action: "migrate"
      /** The name of the index being migrated. */
      index: string
      /** The physical index the new version is built under. */
      physical_name: string
      /** A hash of the definition the new version is built from. */
      definition_hash: string
      /** The new version's number. */
      version: number
      /** The physical index of the version currently serving reads. */
      active_physical_name: string
      /** A hash of the definition the active version was built from. */
      active_definition_hash: string
      /** The provider the new version is built on. */
      provider: string
      /** Set only when it differs from `provider`, so a later migration cleans up the old engine's data. */
      previous_provider?: string
    }
  | {
      /** The index already matches its definition. */
      action: "noop"
      /** The name of the index that's up to date. */
      index: string
      /** The physical index behind it. */
      physical_name: string
      /** A hash of the definition the index was built from. */
      definition_hash: string
    }
