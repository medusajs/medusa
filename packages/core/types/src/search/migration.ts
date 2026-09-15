/**
 * A step in bringing the physical indexes in line with the loaded definitions.
 *
 * Planned and executed separately, like link migrations, so that `db:migrate`
 * can show what it is about to do. Every action is idempotent: running the plan
 * twice is a no-op.
 */
export type SearchIndexMigrationAction =
  | {
      /**
       * No version of this index has ever gone live. A new version is built,
       * to be filled and made active at application start.
       */
      action: "create"

      /**
       * The name of the index to create.
       */
      index: string

      /**
       * The physical index the new version is built under.
       */
      physical_name: string

      /**
       * A hash of the definition the version is created from.
       */
      definition_hash: string

      /**
       * The new version's number.
       */
      version: number
    }
  | {
      /**
       * The definition changed. A new version is built alongside the version
       * currently serving reads. Only the build happens here — filling the new
       * version and making it active happens at application start.
       */
      action: "migrate"

      /**
       * The name of the index being migrated.
       */
      index: string

      /**
       * The physical index the new version is built under.
       */
      physical_name: string

      /**
       * A hash of the definition the new version is built from.
       */
      definition_hash: string

      /**
       * The new version's number.
       */
      version: number

      /** The physical index of the version currently serving reads. */
      active_physical_name: string

      /** A hash of the definition the active version was built from. */
      active_definition_hash: string

      /** The provider the new version is built on. */
      provider: string

      /**
       * The provider that holds the version currently serving reads. Set only
       * when it differs from `provider`, so a later migration knows to clean up
       * the previous engine's data once this version becomes active.
       */
      previous_provider?: string
    }
  | {
      /**
       * The index already matches its definition, so there's nothing to do.
       */
      action: "noop"

      /**
       * The name of the index that's up to date.
       */
      index: string

      /**
       * The physical index behind it.
       */
      physical_name: string

      /**
       * A hash of the definition the index was built from.
       */
      definition_hash: string
    }
