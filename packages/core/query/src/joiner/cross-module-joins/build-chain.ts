import { CrossModuleJoinSpec } from "@medusajs/types"
import { composeTableName } from "@medusajs/utils"
import { GraphCatalog } from "../catalog"
import { resolveFieldAliasEntry } from "../helpers"
import { InternalJoinerServiceConfig } from "../types"
import { ChainLevel, ChainResolution, Hop } from "./types"

type ChainContext = {
  rootConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
}

/**
 * Where the chain currently stands while consuming hops: the table and key
 * the next level must correlate against, and the module that table belongs
 * to. Starts at the root entity and advances to each level's target.
 */
type ChainPosition = {
  correlateKey: string
  currentTable?: string
  serviceName: string
}

/**
 * One consumed hop shape, mapped to a join level. The dispatcher attaches
 * `parent` and advances the position.
 */
type ChainStep = {
  spec: CrossModuleJoinSpec
  entity?: string
  properties: string[]
  serviceName: string
  consumedHops: 1 | 2
}

/**
 * Resolves a relation path all the way to a pushable join chain, classifying
 * paths that cannot be pushed (see {@link ChainResolution}).
 */
export function resolveChain(
  params: {
    rootConfig: InternalJoinerServiceConfig
    pathSegments: string[]
  },
  catalog: GraphCatalog
): ChainResolution {
  const hops = resolvePathHops(params, catalog)

  if (!hops || !crossesModules(hops, params.rootConfig)) {
    return { outcome: "native" }
  }

  const levels = buildChainLevels({
    hops,
    rootConfig: params.rootConfig,
    catalog,
  })

  return levels ? { outcome: "pushable", levels } : { outcome: "residual" }
}

/**
 * Resolves an alias-form relation path into per-hop info, expanding
 * fieldAlias shortcuts (e.g. `price_set` -> `price_set_link.price_set`) the
 * same way compile's parseProperties does. A segment resolves either to a
 * module-internal DML relation (from alias `__internal.relations` metadata)
 * or to a catalog relationship (link modules, read-only links). Returns
 * undefined when a segment resolves to neither, or when the graph schema
 * disagrees with the DML relation metadata.
 */
export function resolvePathHops(
  params: {
    rootConfig: InternalJoinerServiceConfig
    pathSegments: string[]
  },
  catalog: GraphCatalog
): Hop[] | undefined {
  const { rootConfig, pathSegments } = params

  const hops: Hop[] = []
  let currentConfig = rootConfig
  let entity = rootConfig.entity
  let internalTrail: string[] = []

  for (const segment of pathSegments) {
    const aliasEntry = resolveFieldAliasEntry(
      currentConfig.fieldAlias?.[segment],
      entity
    )
    const realSegments = aliasEntry ? aliasEntry.path.split(".") : [segment]

    for (const realSegment of realSegments) {
      const internalRelation =
        catalog.getAliasMetadata(entity)?.relations?.[realSegment]

      if (internalRelation) {
        // The graph schema must agree with the DML relation. Modules that
        // remap relations in a custom schema (e.g. order.items resolves to
        // OrderLineItem while the DML relation targets OrderItem) cannot be
        // traversed from the derived metadata.
        const schemaEntity = entity
          ? catalog.getEntity(entity, realSegment)
          : undefined
        if (schemaEntity && schemaEntity !== internalRelation.entity) {
          return undefined
        }

        hops.push({
          kind: "internal",
          property: realSegment,
          serviceConfig: currentConfig,
          entity: internalRelation.entity,
          internal: internalRelation,
          internalTrail: [...internalTrail],
        })

        internalTrail.push(realSegment)
        entity = internalRelation.entity
        continue
      }

      let hopEntity = entity
        ? catalog.getEntity(entity, realSegment) ?? entity
        : entity

      const relationship = catalog.getEntityRelationship({
        parentServiceConfig: currentConfig,
        property: realSegment,
        entity: hopEntity,
      })

      if (!relationship) {
        return undefined
      }

      hopEntity = relationship.entity ?? hopEntity

      const nextConfig = catalog.getServiceConfig({
        serviceName: relationship.serviceName,
        entity: relationship.entity,
      })

      if (!nextConfig) {
        return undefined
      }

      hops.push({
        kind: "relationship",
        property: realSegment,
        relationship,
        serviceConfig: nextConfig,
        entity: hopEntity,
        internalTrail: [...internalTrail],
      })

      internalTrail = []
      currentConfig = nextConfig
      entity = hopEntity
    }
  }

  return hops.length ? hops : undefined
}

function crossesModules(
  hops: Hop[] | undefined,
  rootConfig: InternalJoinerServiceConfig
): boolean {
  return !!hops?.some(
    (hop) => hop.serviceConfig.serviceName !== rootConfig.serviceName
  )
}

/**
 * Maps the resolved hops onto {@link CrossModuleJoinSpec}s, chaining via
 * `parent`. Three hop shapes are supported, one builder each:
 *
 * - (link module -> target) pairs: the link table joins the current position
 *   to an entity of another module.
 * - Read-only link hops: an FK column on the current position's table points
 *   at another module's entity. When the FK follows an internal hasMany hop,
 *   both fuse into a single spec with the internal child table acting as the
 *   link table (e.g. cart -> items -> product becomes
 *   `cart_line_item(cart_id -> product_id) -> product`).
 * - Module-internal DML relation hops (hasMany/belongsTo), standing alone as
 *   self-join levels so deeper levels can chain on them.
 */
export function buildChainLevels(params: {
  hops: Hop[]
  rootConfig: InternalJoinerServiceConfig
  catalog: GraphCatalog
}): ChainLevel[] | undefined {
  const { hops, rootConfig, catalog } = params

  if (!hops.length) {
    return undefined
  }

  const context: ChainContext = { rootConfig, catalog }
  const levels: ChainLevel[] = []
  const realPath: string[] = []

  // The DAL correlates the root EXISTS against the entity's "id" column and
  // chained joins against the parent target's primaryKey.
  const position: ChainPosition = {
    correlateKey: "id",
    currentTable: catalog.getAliasMetadata(rootConfig.entity)?.tableName,
    serviceName: rootConfig.serviceName,
  }
  let parentTable: string | undefined

  let i = 0
  while (i < hops.length) {
    const hop = hops[i]
    const next = hops[i + 1]

    const step =
      hop.kind === "internal"
        ? buildInternalRelationStep(hop, next, position, context)
        : hop.serviceConfig.isLink
        ? buildLinkModuleStep(hop, next, position, context)
        : buildReadOnlyLinkStep(hop, position, context)

    if (!step) {
      return undefined
    }

    realPath.push(...step.properties)
    levels.push({
      realPathKey: realPath.join("."),
      entity: step.entity,
      spec: parentTable ? { parent: parentTable, ...step.spec } : step.spec,
    })

    parentTable = step.spec.target.table
    position.correlateKey = step.spec.target.primaryKey ?? "id"
    position.currentTable = parentTable
    position.serviceName = step.serviceName
    i += step.consumedHops
  }

  return levels
}

/**
 * Module-internal DML relation hops. A hasMany hop followed by a read-only
 * link fuses into a single spec (the child table acts as the link table);
 * standing alone it becomes a self-join level, and belongsTo joins off the
 * current position's table.
 */
function buildInternalRelationStep(
  hop: Hop,
  next: Hop | undefined,
  position: ChainPosition,
  context: ChainContext
): ChainStep | undefined {
  const { catalog } = context
  const relation = hop.internal!
  const tableMetadata = catalog.getAliasMetadata(hop.entity)

  if (!tableMetadata?.tableName || !isSimpleKey(relation.foreignKey)) {
    return undefined
  }

  if (relation.foreignKeyOwner === "target") {
    // hasMany: the child's FK column references the parent's id column.
    if (position.correlateKey !== "id") {
      return undefined
    }

    const isFusableNext =
      next?.kind === "relationship" && !next.serviceConfig.isLink

    if (isFusableNext) {
      const fkHop = resolveFkHopParts(next, position, context)
      if (!fkHop) {
        return undefined
      }

      // Only forward read-only links fuse (their FK column lives on this
      // internal child table). Inverse ones chain off the child's own PK, so
      // the standalone self-join below is emitted and the loop consumes the
      // read-only hop on its own.
      if (fkHop.direction === "forward") {
        return {
          spec: {
            link: {
              table: tableMetadata.tableName,
              sourceKey: relation.foreignKey,
              targetKey: fkHop.column,
            },
            target: fkHop.target,
          },
          entity: next.entity,
          properties: [hop.property, next.property],
          serviceName: next.serviceConfig.serviceName,
          consumedHops: 2,
        }
      }
    }

    // Standalone internal hop: a self-join level deeper levels chain on.
    return {
      spec: {
        link: {
          table: tableMetadata.tableName,
          sourceKey: relation.foreignKey,
          targetKey: "id",
        },
        target: {
          table: tableMetadata.tableName,
          ...(tableMetadata.schema ? { schema: tableMetadata.schema } : {}),
          primaryKey: "id",
        },
      },
      entity: hop.entity,
      properties: [hop.property],
      serviceName: position.serviceName,
      consumedHops: 1,
    }
  }

  // belongsTo: the FK column lives on the current position's table.
  if (!position.currentTable) {
    return undefined
  }

  return {
    spec: {
      link: {
        table: position.currentTable,
        sourceKey: position.correlateKey,
        targetKey: relation.foreignKey,
      },
      target: {
        table: tableMetadata.tableName,
        ...(tableMetadata.schema ? { schema: tableMetadata.schema } : {}),
        primaryKey: "id",
      },
    },
    entity: hop.entity,
    properties: [hop.property],
    serviceName: position.serviceName,
    consumedHops: 1,
  }
}

/**
 * (link module -> target) pairs: the link table joins the current position to
 * an entity of another module.
 */
function buildLinkModuleStep(
  hop: Hop,
  targetHop: Hop | undefined,
  position: ChainPosition,
  context: ChainContext
): ChainStep | undefined {
  const { rootConfig, catalog } = context
  const linkConfig = hop.serviceConfig

  if (!targetHop || targetHop.kind !== "relationship") {
    return undefined
  }

  const linkRel = hop.relationship!
  const targetRel = targetHop.relationship!

  if (linkRel.inverse || targetRel.inverse) {
    return undefined
  }

  if (
    !isSimpleKey(linkRel.primaryKey) ||
    !isSimpleKey(linkRel.foreignKey) ||
    !isSimpleKey(targetRel.primaryKey) ||
    !isSimpleKey(targetRel.foreignKey)
  ) {
    return undefined
  }

  if (linkRel.foreignKey !== position.correlateKey) {
    return undefined
  }

  // The root and target modules must live in the same database. Link modules
  // are not compared: they always run on the app's shared connection and
  // their resolved databaseClientUrl is not reliable.
  if (
    targetHop.serviceConfig.databaseClientUrl !== rootConfig.databaseClientUrl
  ) {
    return undefined
  }

  const metadata = catalog.getAliasMetadata(targetHop.entity)
  if (!metadata?.tableName) {
    return undefined
  }

  const linkTable = resolveLinkTableName(linkConfig)
  if (!linkTable) {
    return undefined
  }

  return {
    spec: {
      link: {
        table: linkTable,
        sourceKey: linkRel.primaryKey,
        targetKey: targetRel.foreignKey,
      },
      target: {
        table: metadata.tableName,
        ...(metadata.schema ? { schema: metadata.schema } : {}),
        primaryKey: targetRel.primaryKey,
      },
    },
    entity: targetHop.entity,
    properties: [hop.property, targetHop.property],
    serviceName: targetHop.serviceConfig.serviceName,
    consumedHops: 2,
  }
}

/**
 * Read-only link hop directly off the current position.
 */
function buildReadOnlyLinkStep(
  hop: Hop,
  position: ChainPosition,
  context: ChainContext
): ChainStep | undefined {
  const fkHop = resolveFkHopParts(hop, position, context)

  if (!fkHop) {
    return undefined
  }

  if (fkHop.direction === "inverse") {
    // Self-join on the target table: the target-side column correlates to
    // the current position while deeper levels chain on the target's PK.
    return {
      spec: {
        link: {
          table: fkHop.target.table,
          ...(fkHop.target.schema ? { schema: fkHop.target.schema } : {}),
          sourceKey: fkHop.targetColumn,
          targetKey: "id",
        },
        target: fkHop.target,
      },
      entity: hop.entity,
      properties: [hop.property],
      serviceName: hop.serviceConfig.serviceName,
      consumedHops: 1,
    }
  }

  if (!position.currentTable) {
    return undefined
  }

  return {
    spec: {
      link: {
        table: position.currentTable,
        sourceKey: position.correlateKey,
        targetKey: fkHop.column,
      },
      target: fkHop.target,
    },
    entity: hop.entity,
    properties: [hop.property],
    serviceName: hop.serviceConfig.serviceName,
    consumedHops: 1,
  }
}

type FkHopParts =
  | {
      /** The FK column lives on the current position's side. */
      direction: "forward"
      column: string
      target: CrossModuleJoinSpec["target"]
    }
  | {
      /** The join column lives on the target table. */
      direction: "inverse"
      targetColumn: string
      target: CrossModuleJoinSpec["target"]
    }

/**
 * Validates a read-only link hop and resolves its join columns and target
 * table. Read-only links come in two directions:
 *
 * - forward: the FK column lives on the current position's side and the
 *   relationship's `primaryKey` is the target's PK (e.g.
 *   `cart_line_item.product_id -> product.id`).
 * - inverse: the join column lives on the target table (e.g.
 *   `organization.id -> project.organization_id`), in which case the parent
 *   side must be the current correlate column.
 */
function resolveFkHopParts(
  hop: Hop,
  position: ChainPosition,
  context: ChainContext
): FkHopParts | undefined {
  const { rootConfig, catalog } = context
  const relationship = hop.relationship!

  if (relationship.inverse) {
    return undefined
  }

  // Same-service relationship hops are only traversable through internal
  // relation metadata; alias-generated relationships carry fabricated keys.
  if (relationship.serviceName === position.serviceName) {
    return undefined
  }

  const fkSegments = relationship.foreignKey.split(".")
  const column = fkSegments[fkSegments.length - 1]
  const prefix = fkSegments.slice(0, -1)

  // The dotted prefix declares the relation path the FK column lives on
  // (e.g. `items.product_id`) — it must match the internal hops traversed to
  // reach this position.
  if (prefix.join(".") !== hop.internalTrail.join(".")) {
    return undefined
  }

  if (column.includes(",") || !isSimpleKey(relationship.primaryKey)) {
    return undefined
  }

  const targetMetadata = catalog.getAliasMetadata(hop.entity)
  if (!targetMetadata?.tableName) {
    return undefined
  }

  // The resolved entity must actually belong to the relationship's target
  // module, otherwise the table would be wrong.
  const entityConfig = hop.entity
    ? catalog.getServiceConfig({ entity: hop.entity })
    : undefined
  if (entityConfig?.serviceName !== relationship.serviceName) {
    return undefined
  }

  if (hop.serviceConfig.databaseClientUrl !== rootConfig.databaseClientUrl) {
    return undefined
  }

  // The target's PK is always "id" for the spec so deeper levels chain on
  // the real primary key regardless of the link direction.
  const target = {
    table: targetMetadata.tableName,
    ...(targetMetadata.schema ? { schema: targetMetadata.schema } : {}),
    primaryKey: "id",
  }

  if (relationship.primaryKey === "id") {
    return { direction: "forward", column, target }
  }

  // Inverse: `primaryKey` is the join column on the target table, and the
  // parent-side column must correlate directly to the current position.
  if (column !== position.correlateKey) {
    return undefined
  }

  return {
    direction: "inverse",
    targetColumn: relationship.primaryKey,
    target,
  }
}

function resolveLinkTableName(
  linkConfig: InternalJoinerServiceConfig
): string | undefined {
  if (linkConfig.databaseConfig?.tableName) {
    return linkConfig.databaseConfig.tableName
  }

  const relationships = linkConfig.relationships
    ? Array.from(linkConfig.relationships.values()).flat()
    : []

  // Exclude the alias-generated self relationships the catalog adds.
  const moduleRelationships = relationships.filter(
    (rel) => rel.serviceName !== linkConfig.serviceName
  )

  if (moduleRelationships.length !== 2) {
    return undefined
  }

  const [primary, foreign] = moduleRelationships

  // Mirrors the default naming in link-modules' generateEntity.
  return composeTableName(
    primary.serviceName,
    primary.foreignKey,
    foreign.serviceName,
    foreign.foreignKey
  ).toLowerCase()
}

function isSimpleKey(key: string): boolean {
  return !key.includes(",") && !key.includes(".")
}
