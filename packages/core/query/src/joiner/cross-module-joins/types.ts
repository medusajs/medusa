import {
  CrossModuleJoinSpec,
  JoinerRelationship,
  JoinerServiceConfigAlias,
} from "@medusajs/types"
import { InternalJoinerServiceConfig } from "../types"

export type InternalRelationMetadata = NonNullable<
  NonNullable<JoinerServiceConfigAlias["__internal"]>["relations"]
>[string]

/**
 * One resolved segment of a relation path. A hop either follows a catalog
 * relationship (link modules, read-only links) or a module-internal DML
 * relation described by alias `__internal.relations` metadata.
 */
export type Hop = {
  kind: "relationship" | "internal"
  property: string
  serviceConfig: InternalJoinerServiceConfig
  entity?: string
  relationship?: JoinerRelationship
  internal?: InternalRelationMetadata
  /**
   * Properties of the contiguous module-internal hops immediately preceding
   * this hop. Used to validate the dotted prefix of read-only link foreign
   * keys (e.g. `items.product_id` requires having traversed `items`).
   */
  internalTrail: string[]
}

export type ChainLevel = {
  /** Dotted real (post fieldAlias) path identifying this join level. */
  realPathKey: string
  entity?: string
  spec: CrossModuleJoinSpec
}

/**
 * Outcome of resolving a relation path into a pushable join chain.
 *
 * - `native`: the path stays within the root module (or does not resolve to
 *   relations at all) — the module handles it natively.
 * - `residual`: the path crosses modules but cannot be pushed down to SQL.
 * - `pushable`: the join chain the path maps onto.
 */
export type ChainResolution =
  | { outcome: "native" }
  | { outcome: "residual" }
  | { outcome: "pushable"; levels: ChainLevel[] }

export type PushdownCandidate = {
  levels: ChainLevel[]
  filters: Record<string, unknown>
}

/**
 * Join specs registered for the query so far, keyed by their real (post
 * fieldAlias) join path. Key insertion order is the emission order of
 * `crossModuleJoins`.
 */
export type SpecRegistry = Record<string, CrossModuleJoinSpec>
