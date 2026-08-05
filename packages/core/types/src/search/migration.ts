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
      index: string
      physical_name: string
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
      index: string
      definition_hash: string
      live_definition_hash: string
    }
  | {
      action: "noop"
      index: string
      physical_name: string
      definition_hash: string
    }
