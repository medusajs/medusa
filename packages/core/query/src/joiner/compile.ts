import { RemoteJoinerQuery } from "@medusajs/types"
import { deduplicate, isDefined } from "@medusajs/utils"
import { GraphCatalog } from "./catalog"
import {
  consumeResiduals,
  extractCrossModuleJoins,
} from "./cross-module-joins"
import {
  getNestedItems,
  resolveFieldAliasEntry,
  ResolvedFieldAlias,
} from "./helpers"
import {
  BASE_PATH,
  CompileInput,
  ComputedJoinerRelationship,
  ExecutionStage,
  InternalJoinerServiceConfig,
  QueryPlan,
  RemoteExpandProperty,
  ShortcutSpec,
} from "./types"

/**
 * Compiles a {@link RemoteJoinerQuery} into an executable {@link QueryPlan}.
 *
 * Field-alias shortcuts are rewritten into real relationship paths and recorded
 * as {@link ShortcutSpec}s. Same-service consecutive hops are nested so one
 * module fetch can load multiple levels.
 */

/**
 * Example walkthrough — order with fieldAlias + nested expand:
 *
 *   alias: "order"
 *   fields: ["id"]
 *   expands: [
 *     { property: "product_user_alias", fields: ["id", "email"], args: [...] },
 *     { property: "products.variant" }
 *   ]
 *
 * Compile produces roughly:
 *   expands: {
 *     _root → order service, fields [id], stages [...]
 *     _root.products → still on order (same service hop toward product via nested)
 *     _root.products.product → product service (cross-service boundary)
 *     _root.products.product.user → user service
 *     _root.products.variant → product service
 *   }
 *   shortcuts: [{ location: [], property: "product_user_alias", path: ["products","product","user"] }]
 *   stages[0] = root; stages[1] = product + variant; stages[2] = user
 */
export function compileQuery(
  { query, serviceConfig, options, initialData }: CompileInput,
  catalog: GraphCatalog
): QueryPlan {
  const { crossModuleJoins, residualCrossModuleFilters, residualOrderBy } =
    extractCrossModuleJoins({ query, serviceConfig }, catalog)

  if (crossModuleJoins.length) {
    query.args ??= []
    query.args.push({ name: "__internal", value: { crossModuleJoins } })
  }

  // Stage 2: residual filters/orderings are consumed here (stripped from the
  // query, their data loaded via injected expands) and completed in memory by
  // executePlan after the fetch.
  const residualHiddenProperties =
    residualCrossModuleFilters.length || residualOrderBy.length
      ? consumeResiduals(
          {
            query,
            serviceConfig,
            residualFilters: residualCrossModuleFilters,
            residualOrderBy,
          },
          catalog
        )
      : []

  const { primaryKeyArg, otherArgs, pkName } = getPrimaryKeysAndOtherFilters({
    serviceConfig,
    queryObj: query,
  })

  const root: RemoteExpandProperty = {
    property: "",
    parent: "",
    serviceConfig,
    entity: serviceConfig.entity,
    fields: query.fields,
    args: otherArgs,
  }

  const shortcuts: ShortcutSpec[] = []
  const { parsedExpands, aliasRealPathMap } = parseProperties(
    {
      root,
      query,
      serviceConfig,
      expands: query.expands ?? [],
      shortcuts,
    },
    catalog
  )

  if (initialData.length && options?.initialDataOnly) {
    applySeedFilters({
      initialData,
      parsedExpands,
      aliasRealPathMap,
      catalog,
    })
  }

  const grouped = groupSameServiceExpands(parsedExpands)
  attachExecutionStages(parsedExpands, grouped)

  return {
    root: grouped.get(BASE_PATH)!,
    expands: grouped,
    shortcuts,
    pkName,
    primaryKeyArg,
    otherArgs,
    initialData,
    initialDataOnly: options?.initialDataOnly,
    options,
    crossModuleJoins,
    residualCrossModuleFilters,
    residualHiddenProperties,
    residualOrderBy,
  }
}

function parseProperties(
  params: {
    root: RemoteExpandProperty
    query: RemoteJoinerQuery
    serviceConfig: InternalJoinerServiceConfig
    expands: NonNullable<RemoteJoinerQuery["expands"]>
    shortcuts: ShortcutSpec[]
  },
  catalog: GraphCatalog
): {
  parsedExpands: Map<string, RemoteExpandProperty>
  aliasRealPathMap: Map<string, string[]>
} {
  const { root, query, serviceConfig, expands, shortcuts } = params

  const aliasRealPathMap = new Map<string, string[]>()
  const parsedExpands = new Map<string, RemoteExpandProperty>()
  parsedExpands.set(BASE_PATH, root)

  const forwardArgumentsOnPath: string[] = []

  // Intentionally iterate a mutable array: rewriteFieldAlias pushes synthetic
  // expand entries so the same loop walks rewritten real paths.
  for (const expand of expands) {
    const properties = expand.property.split(".")
    const currentPath: string[] = []
    const currentAliasPath: string[] = []
    let currentServiceConfig = serviceConfig

    for (const prop of properties) {
      const fieldAlias = currentServiceConfig.fieldAlias ?? {}
      const currentPathEntity =
        parsedExpands.get([BASE_PATH, ...currentPath].join("."))?.entity ??
        currentServiceConfig.entity
      const aliasEntry = resolveFieldAliasEntry(
        fieldAlias[prop],
        currentPathEntity
      )

      if (aliasEntry) {
        const aliasPath = [BASE_PATH, ...currentPath, prop].join(".")

        currentServiceConfig = rewriteFieldAlias(
          {
            aliasPath,
            aliasRealPathMap,
            expands,
            expand,
            property: prop,
            aliasEntry,
            parsedExpands,
            currentServiceConfig,
            currentPath,
            shortcuts,
            forwardArgumentsOnPath,
          },
          catalog
        )

        currentAliasPath.push(prop)
        continue
      }

      const fullPath = [BASE_PATH, ...currentPath, prop].join(".")
      const fullAliasPath = [BASE_PATH, ...currentAliasPath, prop].join(".")

      let entity = currentServiceConfig.entity
      if (entity) {
        const completePath = fullPath.split(".")
        for (let i = 1; i < completePath.length; i++) {
          entity = catalog.getEntity(entity, completePath[i]) ?? entity
        }
      }

      const relationship = catalog.getEntityRelationship({
        parentServiceConfig: currentServiceConfig,
        property: prop,
        entity,
      })

      const isCurrentProp =
        fullPath === BASE_PATH + "." + expand.property ||
        fullAliasPath === BASE_PATH + "." + expand.property

      let fields: string[] = isCurrentProp ? expand.fields ?? [] : []
      const args = isCurrentProp ? expand.args : []

      if (relationship) {
        const parentExpand =
          parsedExpands.get([BASE_PATH, ...currentPath].join(".")) ||
          (query as any)

        if (parentExpand) {
          injectJoinKeys(parentExpand, relationship, "parent")
          fields = fields.concat(joinKeyFields(relationship, "child"))
        }

        entity = relationship.entity ?? entity

        currentServiceConfig = catalog.getServiceConfig({
          serviceName: relationship.serviceName,
          entity: relationship.entity,
        })!

        if (!currentServiceConfig) {
          throw new Error(
            `Target service not found: ${relationship.serviceName}`
          )
        }
      }

      const isAliasMapping = !!(expand as any).isAliasMapping
      if (!parsedExpands.has(fullPath)) {
        let parentPath = [BASE_PATH, ...currentPath].join(".")

        if (aliasRealPathMap.has(parentPath)) {
          parentPath = aliasRealPathMap.get(parentPath)!.slice(0, -1).join(".")
        }

        parsedExpands.set(fullPath, {
          property: prop,
          serviceConfig: currentServiceConfig,
          entity,
          fields,
          args: isAliasMapping
            ? forwardArgumentsOnPath.includes(fullPath)
              ? args
              : undefined
            : args,
          isAliasMapping,
          parent: parentPath,
          parentConfig: parsedExpands.get(parentPath)!.serviceConfig,
        })
      } else {
        const exp = parsedExpands.get(fullPath)!

        if (forwardArgumentsOnPath.includes(fullPath) && args) {
          exp.args = (exp.args || []).concat(args)
        }
        exp.isAliasMapping ??= isAliasMapping

        if (fields) {
          exp.fields = deduplicate((exp.fields ?? []).concat(fields))
        }
      }

      currentPath.push(prop)
      currentAliasPath.push(prop)
    }
  }

  return { parsedExpands, aliasRealPathMap }
}

/**
 * Rewrites a fieldAlias into real relationship hops, records a ShortcutSpec
 * for post-join collapse, and injects synthetic expand entries for the real path.
 */
function rewriteFieldAlias(
  params: {
    aliasPath: string
    aliasRealPathMap: Map<string, string[]>
    expands: NonNullable<RemoteJoinerQuery["expands"]>
    expand: any
    property: string
    aliasEntry: ResolvedFieldAlias
    parsedExpands: Map<string, RemoteExpandProperty>
    currentServiceConfig: InternalJoinerServiceConfig
    currentPath: string[]
    shortcuts: ShortcutSpec[]
    forwardArgumentsOnPath: string[]
  },
  catalog: GraphCatalog
): InternalJoinerServiceConfig {
  const {
    aliasPath,
    aliasRealPathMap,
    expands,
    expand,
    property,
    aliasEntry,
    parsedExpands,
    currentPath,
    shortcuts,
    forwardArgumentsOnPath,
  } = params

  let currentServiceConfig = params.currentServiceConfig
  const serviceConfig = currentServiceConfig
  const alias = aliasEntry

  const path = alias.path
  const fieldAliasIsList = !!alias.isList
  const fullPath = [...currentPath.concat(path.split("."))]

  if (aliasRealPathMap.has(aliasPath)) {
    currentPath.push(...path.split("."))
    const existing = [BASE_PATH, ...currentPath].join(".")
    return parsedExpands.get(existing)!.serviceConfig
  }

  const parentPath = [BASE_PATH, ...currentPath].join(".")
  const parentExpands = parsedExpands.get(parentPath)!
  parentExpands.fields = parentExpands.fields?.filter(
    (field) => field !== property
  )

  forwardArgumentsOnPath.push(
    ...(alias?.forwardArgumentsOnPath || []).map(
      (forPath) => BASE_PATH + "." + currentPath.concat(forPath).join(".")
    )
  )

  const parentFieldAlias = fullPath[Math.max(fullPath.length - 2, 0)]
  const parentRel = serviceConfig.relationships?.get(parentFieldAlias)
  // Match legacy behavior: when multiple relationships share an alias (array),
  // `.isList` is not read off the array itself. Prefer the fieldAlias flag.
  const parentRelIsList = Array.isArray(parentRel) ? false : !!parentRel?.isList
  shortcuts.push({
    location: [...currentPath],
    property,
    path: fullPath,
    isList: fieldAliasIsList || parentRelIsList,
  })

  const middlePath = path.split(".")
  let curMiddlePath = currentPath
  for (const mid of middlePath) {
    curMiddlePath = curMiddlePath.concat(mid)

    const midProp = curMiddlePath.join(".")
    const existingExpand = expands.find((exp) => exp.property === midProp)

    const extraExtends: any = {
      fields: existingExpand?.fields,
      args: existingExpand?.args,
      ...(midProp === fullPath.join(".") ? expand : {}),
      property: midProp,
      isAliasMapping: !existingExpand,
    }

    if (forwardArgumentsOnPath.includes(BASE_PATH + "." + midProp)) {
      const forwarded = (existingExpand?.args ?? []).concat(expand?.args ?? [])
      if (forwarded.length) {
        extraExtends.args = forwarded
      }
    }

    expands.push(extraExtends)
  }

  const partialPath: string[] = []
  for (const partial of path.split(".")) {
    const completePath = [
      BASE_PATH,
      ...currentPath.concat(partialPath),
      partial,
    ]
    const parent = completePath.slice(0, -1).join(".")

    let entity = serviceConfig.entity
    if (entity) {
      for (let i = 1; i < completePath.length; i++) {
        entity = catalog.getEntity(entity, completePath[i]) ?? entity
      }
    }

    const relationship = catalog.getEntityRelationship({
      parentServiceConfig: currentServiceConfig,
      property: partial,
      entity,
    })

    if (relationship) {
      entity = relationship.entity ?? entity

      currentServiceConfig = catalog.getServiceConfig({
        serviceName: relationship.serviceName,
        entity: relationship.entity,
      })!

      if (!currentServiceConfig) {
        throw new Error(`Target service not found: ${relationship.serviceName}`)
      }
    }

    partialPath.push(partial)
    parsedExpands.set(completePath.join("."), {
      property: partial,
      serviceConfig: currentServiceConfig,
      entity,
      parent,
      parentConfig: parsedExpands.get(parent)!.serviceConfig,
    })
  }

  currentPath.push(...path.split("."))
  aliasRealPathMap.set(aliasPath, [BASE_PATH, ...currentPath])

  return currentServiceConfig
}

function joinKeyFields(
  relationship: ComputedJoinerRelationship,
  side: "parent" | "child"
): string[] {
  if (side === "parent") {
    const field = relationship.inverse
      ? relationship.primaryKey
      : relationship.foreignKey.split(".").pop()!
    return field.split(",")
  }

  const field = relationship.inverse
    ? relationship.foreignKey.split(".").pop()!
    : relationship.primaryKey
  return field.split(",")
}

function injectJoinKeys(
  parentExpand: { fields?: string[] },
  relationship: ComputedJoinerRelationship,
  _side: "parent"
) {
  parentExpand.fields ??= []
  parentExpand.fields = parentExpand.fields
    .concat(joinKeyFields(relationship, "parent"))
    .filter((field) => field !== relationship.alias)
  parentExpand.fields = deduplicate(parentExpand.fields)
}

/**
 * Collapses consecutive same-service hops into nested `expands` on the
 * nearest cross-service (or root) ancestor.
 */
function groupSameServiceExpands(
  parsedExpands: Map<string, RemoteExpandProperty>
): Map<string, RemoteExpandProperty> {
  const mergedExpands = new Map<string, RemoteExpandProperty>(parsedExpands)
  const mergedPaths = new Map<string, RemoteExpandProperty>()

  for (const [path, expand] of mergedExpands.entries()) {
    const currentServiceName = expand.serviceConfig.serviceName
    let parentPath = expand.parent

    while (parentPath) {
      const parentExpand =
        mergedExpands.get(parentPath) ?? mergedPaths.get(parentPath)
      if (
        !parentExpand ||
        parentExpand.serviceConfig.serviceName !== currentServiceName
      ) {
        break
      }

      const nestedKeys = path.split(".").slice(parentPath.split(".").length)
      let targetExpand = parentExpand as Omit<
        RemoteExpandProperty,
        "expands"
      > & {
        expands?: Record<string, any>
      }

      for (const key of nestedKeys) {
        targetExpand.expands ??= {}
        targetExpand = targetExpand.expands[key] ??= {}
      }

      targetExpand.fields = [
        ...new Set([...(targetExpand.fields ?? []), ...(expand.fields ?? [])]),
      ]
      if (expand.args?.length) {
        targetExpand.args = targetExpand.args
          ? targetExpand.args.concat(expand.args)
          : expand.args
      }

      mergedExpands.delete(path)
      mergedPaths.set(path, expand)
      parentPath = parentExpand.parent
    }
  }

  return mergedExpands
}

/**
 * Attaches depth-batched execution stages onto the root expand.
 */
function attachExecutionStages(
  fullParsedExpands: Map<string, RemoteExpandProperty>,
  groupedExpands: Map<string, RemoteExpandProperty>
): void {
  const stages: ExecutionStage[][] = []

  const rootExp = groupedExpands.get(BASE_PATH)!
  stages.push([
    {
      service: rootExp.serviceConfig.serviceName,
      entity: rootExp.entity,
      paths: [],
      depth: 0,
    },
  ])

  const getServiceSequence = (path: string): string[] => {
    const sequence: string[] = []
    let currentPath = path

    while (currentPath && currentPath !== BASE_PATH) {
      const expand = fullParsedExpands.get(currentPath)
      if (!expand) {
        break
      }
      sequence.unshift(expand.serviceConfig.serviceName)
      currentPath = expand.parent
    }
    return sequence
  }

  const pathsBySequenceDepth = new Map<number, Map<string, string[]>>()

  for (const [path, expand] of groupedExpands.entries()) {
    if (path === BASE_PATH) {
      continue
    }

    const sequenceDepth = getServiceSequence(path).length
    const lastService = expand.serviceConfig.serviceName

    if (!pathsBySequenceDepth.has(sequenceDepth)) {
      pathsBySequenceDepth.set(sequenceDepth, new Map())
    }

    const depthMap = pathsBySequenceDepth.get(sequenceDepth)!
    if (!depthMap.has(lastService)) {
      depthMap.set(lastService, [])
    }
    depthMap.get(lastService)!.push(path)
  }

  const depths = Array.from(pathsBySequenceDepth.keys())
  const maxDepth = depths.length ? Math.max(...depths) : 0

  for (let depth = 1; depth <= maxDepth; depth++) {
    const serviceMap = pathsBySequenceDepth.get(depth)
    if (!serviceMap) {
      continue
    }

    const stageGroups: ExecutionStage[] = []
    for (const [service, paths] of serviceMap.entries()) {
      stageGroups.push({ service, paths, depth })
    }
    if (stageGroups.length) {
      stages.push(stageGroups)
    }
  }

  rootExp.executionStages = stages
}

function applySeedFilters(params: {
  initialData: any[]
  parsedExpands: Map<string, RemoteExpandProperty>
  aliasRealPathMap: Map<string, string[]>
  catalog: GraphCatalog
}): void {
  const { initialData, parsedExpands, aliasRealPathMap, catalog } = params

  if (!initialData.length) {
    return
  }

  const getPkValues = ({
    data,
    serviceConfig,
    relationship,
  }: {
    data: any[]
    serviceConfig: InternalJoinerServiceConfig
    relationship?: any
  }): Record<string, any> => {
    if (!data.length || !relationship || !serviceConfig) {
      return {}
    }

    const primaryKeys = relationship.primaryKey
      ? relationship.primaryKey.split(",")
      : serviceConfig.primaryKeys

    const filter: Record<string, any> = {}
    primaryKeys.forEach((key) => {
      filter[key] = Array.from(
        new Set(data.map((dt) => dt[key]).filter(isDefined))
      )
    })
    return filter
  }

  const parsedSegment = new Map<string, any>()
  const aliasReversePathMap = new Map<string, string>(
    Array.from(aliasRealPathMap).map(([path, realPath]) => [
      realPath.join("."),
      path,
    ])
  )

  for (let [path, expand] of parsedExpands.entries()) {
    const serviceConfig = expand.serviceConfig
    const relationship =
      catalog.getEntityRelationship({
        parentServiceConfig: expand.parentConfig!,
        property: expand.property,
      }) ?? serviceConfig.relationships?.get(serviceConfig.serviceName)

    if (!serviceConfig || !relationship) {
      continue
    }

    let aliasToPath: string | null = null
    if (aliasReversePathMap.has(path)) {
      aliasToPath = path
      path = aliasReversePathMap.get(path)!
    }

    const pathSegments = path.split(".")
    let relevantInitialData = initialData
    const fullPath: string[] = []

    for (const segment of pathSegments) {
      fullPath.push(segment)
      if (segment === BASE_PATH) {
        continue
      }

      const pathStr = fullPath.join(".")
      if (parsedSegment.has(pathStr)) {
        relevantInitialData = parsedSegment.get(pathStr)
        continue
      }

      relevantInitialData = getNestedItems(relevantInitialData, segment) ?? []
      parsedSegment.set(pathStr, relevantInitialData)

      if (!relevantInitialData.length) {
        break
      }
    }

    if (!relevantInitialData.length) {
      continue
    }

    const queryPath = expand.parent === "" ? BASE_PATH : aliasToPath ?? path
    const filter = getPkValues({
      data: relevantInitialData,
      serviceConfig,
      relationship,
    })

    if (!Object.keys(filter).length) {
      continue
    }

    const parsed = parsedExpands.get(queryPath)!
    parsed.args ??= []
    parsed.args.push({ name: "filters", value: filter })
  }
}

function getPrimaryKeysAndOtherFilters({
  serviceConfig,
  queryObj,
}: {
  serviceConfig: { primaryKeys: string[]; entity?: string; serviceName: string }
  queryObj: { args?: { name: string; value?: any }[] }
}): {
  primaryKeyArg: { name: string; value?: any } | undefined
  otherArgs: { name: string; value?: any }[] | undefined
  pkName: string
} {
  let pkName = serviceConfig.primaryKeys[0]
  let primaryKeyArg = queryObj.args?.find((arg) => {
    const include = serviceConfig.primaryKeys.includes(arg.name)
    if (include) {
      pkName = arg.name
    }
    return include
  })

  let otherArgs = queryObj.args?.filter(
    (arg) => !serviceConfig.primaryKeys.includes(arg.name)
  )

  if (!primaryKeyArg) {
    const filters =
      queryObj.args?.find((arg) => arg.name === "filters")?.value ?? {}

    const primaryKeyFilter = Object.keys(filters).find((key) =>
      serviceConfig.primaryKeys.includes(key)
    )

    if (primaryKeyFilter) {
      pkName = primaryKeyFilter
      primaryKeyArg = {
        name: primaryKeyFilter,
        value: filters[primaryKeyFilter],
      }

      Object.defineProperty(filters, primaryKeyFilter, {
        value: undefined,
        enumerable: false,
      })
    }
  }

  otherArgs = otherArgs?.length ? otherArgs : undefined

  return { primaryKeyArg, otherArgs, pkName }
}
