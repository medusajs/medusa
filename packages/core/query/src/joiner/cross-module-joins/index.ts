import { CrossModuleJoinSpec, RemoteJoinerQuery } from "@medusajs/types"
import { GraphCatalog } from "../catalog"
import {
  InternalJoinerServiceConfig,
  ResidualCrossModuleFilter,
  ResidualHiddenProperty,
  ResidualOrderBy,
} from "../types"
import {
  consumeResidualFilters,
  createConsumeContext,
} from "./residual-filters"
import { consumeResidualOrderBy } from "./residual-order"
import {
  rewriteExpandFilters,
  rewriteRootFilters,
} from "./rewrite-filters"
import { rewriteRootOrder } from "./rewrite-order"
import { SpecRegistry } from "./types"

/**
 * Stage-1 cross-module filtering/sorting (SQL pushdown).
 *
 * Rewrites eligible cross-module filter/sort paths on the joiner query into
 * {@link CrossModuleJoinSpec}s that the root module's DAL turns into
 * correlated EXISTS/scalar subqueries (see
 * `augmentFindOptionsWithCrossModuleJoins`). Pushed-down filters restrict the
 * ROOT rows — matching `query.index` semantics — and are pruned from the
 * query. Expand nodes that existed only to carry those filters are dropped so
 * they never trigger a fetch.
 *
 * A path is eligible when every hop from the root goes through a link module
 * (link table -> target entity pairs), a read-only link FK, or a
 * module-internal DML relation, all parties live in the same database, and
 * every filtered/sorted field is `crossjoinable` (a non-computed DML column)
 * on its target entity. Anything else — computed fields, unsupported
 * operators, missing metadata, schema-remapped relations — is reported as
 * residual and left untouched on the query. Compile then hands
 * `residualCrossModuleFilters` to the in-memory stage (stage 2, see
 * `residual-filters.ts`), which strips them from the query and completes
 * them after the fetch.
 *
 * Pipeline per filter/sort location:
 *
 *   resolveChain (path -> hops -> spec chain)
 *     -> collectCandidates (filters object -> per-level candidates)
 *     -> registerCandidates (dedupe + unique-target-table constraint)
 *     -> prune the pushed filters from the query
 */
export function extractCrossModuleJoins(
  {
    query,
    serviceConfig,
  }: {
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
  },
  catalog: GraphCatalog
): {
  crossModuleJoins: CrossModuleJoinSpec[]
  residualCrossModuleFilters: ResidualCrossModuleFilter[]
  residualOrderBy: ResidualOrderBy[]
} {
  const registry: SpecRegistry = {}
  const residual: ResidualCrossModuleFilter[] = []

  rewriteRootFilters({ query, serviceConfig, catalog, registry, residual })
  rewriteExpandFilters({ query, serviceConfig, catalog, registry, residual })
  const residualOrderBy = rewriteRootOrder({
    query,
    serviceConfig,
    catalog,
    registry,
  })

  return {
    crossModuleJoins: Object.values(registry),
    residualCrossModuleFilters: residual,
    residualOrderBy,
  }
}

/**
 * Stage-2 compile step: consumes the residual filters and order keys reported
 * by {@link extractCrossModuleJoins}. Strips the filters from the query,
 * loads the data both need through injected expands (see `residual-filters.ts`
 * and `residual-order.ts`), and returns the properties added only for
 * in-memory evaluation so executePlan can hide them.
 */
export function consumeResiduals(
  params: {
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
    residualFilters: ResidualCrossModuleFilter[]
    residualOrderBy: ResidualOrderBy[]
  },
  catalog: GraphCatalog
): ResidualHiddenProperty[] {
  const context = createConsumeContext(
    { query: params.query, serviceConfig: params.serviceConfig },
    catalog
  )

  consumeResidualFilters(context, params.residualFilters)
  consumeResidualOrderBy(context, params.residualOrderBy)

  return context.hidden
}
