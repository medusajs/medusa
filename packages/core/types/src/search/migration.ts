/**
 * A step in bringing the physical indexes in line with the loaded definitions.
 *
 * Planned and executed separately, like link migrations, so that `db:migrate`
 * can show what it is about to do. Every action is idempotent: running the plan
 * twice, or running it at startup after `db:migrate` already did, is a no-op.
 */
export type SearchIndexMigrationAction =
  | {
      /**
       * The index does not exist yet. Nothing is serving it, so it is built
       * directly under its live name and filled in place.
       */
      action: "create"
      /** The name of the index. */
      index: string
      /** The physical name of the index in the search engine. */
      physical_name: string
      /** A hash of the index definition, used to detect changes. */
      definition_hash: string
    }
  | {
      /**
       * The definition changed. Only the build happens here; filling the result
       * and putting it in front of reads happens at application start.
       *
       * On a provider with `swapIndex`, the new schema is built alongside the
       * live index and aliased over once seeded, so reads never see a half-built
       * index. Without one there is nowhere to build, so the live index is
       * replaced in place and holds nothing until the seed runs — which
       * `physical_name === live_physical_name` is the signal for.
       */
      action: "migrate"
      /** The index being built. Derived from `definition_hash` when swapping. */
      physical_name: string
      /** The index serving reads now. */
      live_physical_name: string
      /** The name of the index. */
      index: string
      /** A hash of the updated index definition. */
      definition_hash: string
      /** A hash of the currently live index definition. */
      live_definition_hash: string
      /** The provider the definition now binds to. */
      provider: string
      /**
       * The provider that currently holds this index. Set only when it differs
       * from `provider`, so execute can drop the previous engine's data.
       */
      previous_provider?: string
    }
  | {
      action: "noop"
      /** The name of the index. */
      index: string
      /** The physical name of the index in the search engine. */
      physical_name: string
      /** A hash of the index definition. */
      definition_hash: string
    }
