import { JoinerRelationship, RemoteJoinerOptions } from "@medusajs/types"
import {
  FilterOperatorMap,
  isDefined,
  isObject,
  MedusaError,
} from "@medusajs/utils"
import { GraphCatalog } from "./catalog"
import {
  applyResidualFilters,
  hideResidualProperties,
} from "./cross-module-joins/residual-filters"
import { sortByResidualOrder } from "./cross-module-joins/residual-order"
import { getNestedItems } from "./helpers"
import {
  BASE_PATH,
  ComputedJoinerRelationship,
  InternalJoinerServiceConfig,
  IRemoteDataFetcher,
  QueryPlan,
  RemoteExpandProperty,
  RemoteNestedExpands,
  ShortcutSpec,
} from "./types"

type PathCtx = {
  path: string
  expand: RemoteExpandProperty
  relationship: ComputedJoinerRelationship
  nestedItems: any[]
  field: string
  fieldsArray: string[]
  ids: Set<any>
}

/**
 * Executes a compiled {@link QueryPlan}: fetch root, merge seed data, walk
 * depth stages fetching related rows and joining them onto parents, then
 * collapse fieldAlias shortcuts.
 */

export async function executePlan({
  plan,
  dataFetcher,
  catalog,
}: {
  plan: QueryPlan
  dataFetcher: IRemoteDataFetcher
  catalog: GraphCatalog
}): Promise<{
  data: any
  responsePath?: string
  rawResponse: {
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }
  wasArray: boolean
}> {
  const { options } = plan

  const residuals = plan.residualCrossModuleFilters ?? []
  const residualOrderBy = plan.residualOrderBy ?? []
  const hasResiduals = residuals.length > 0 || residualOrderBy.length > 0
  // Residuals are completed in memory below, so pagination moves with them:
  // pull it off the root fetch and re-apply after filtering/sorting.
  const pagination = hasResiduals
    ? extractRootPagination(plan.root)
    : undefined

  const response = await fetchData({
    dataFetcher,
    expand: plan.root,
    pkField: plan.pkName,
    ids: plan.primaryKeyArg?.value,
    options,
  })

  let data = response.path ? response.data[response.path!] : response.data
  const wasArray = Array.isArray(data)
  data = wasArray ? data : [data]

  if (options?.initialData) {
    data = mergeInitialData({
      items: data,
      initialData: plan.initialData,
      serviceConfig: plan.root.serviceConfig,
      expands: plan.expands.get(BASE_PATH)?.expands,
      relationship: plan.root.serviceConfig.relationships?.get(
        plan.root.serviceConfig.serviceName
      ) as JoinerRelationship | undefined,
      catalog,
    })
    delete options.initialData
  }

  await handleExpands({
    items: data,
    plan,
    dataFetcher,
    catalog,
  })

  if (hasResiduals) {
    if (residuals.length) {
      data = applyResidualFilters({ items: data, residuals })
    }

    if (residualOrderBy.length) {
      sortByResidualOrder({ items: data, orderBy: residualOrderBy })
    }

    if (plan.residualHiddenProperties?.length) {
      hideResidualProperties({
        items: data,
        hidden: plan.residualHiddenProperties,
      })
    }

    const count = data.length

    if (pagination) {
      const skip = pagination.skip ?? 0
      data =
        pagination.take != null
          ? data.slice(skip, skip + pagination.take)
          : skip
          ? data.slice(skip)
          : data

      if (pagination.withMetadata) {
        return {
          data,
          responsePath: "rows",
          rawResponse: {
            data: {
              rows: data,
              metadata: {
                skip: pagination.skip,
                take: pagination.take,
                count,
              },
            },
            path: "rows",
          },
          wasArray,
        }
      }
    }
  }

  return {
    data,
    responsePath: response.path,
    rawResponse: response,
    wasArray,
  }
}

/**
 * Removes pagination args from the root fetch so residuals evaluate against
 * the full (stage-1 filtered) root set. `withMetadata` mirrors the data
 * fetcher's skip/cursor detection, which decides whether the response gets a
 * `{ rows, metadata }` envelope.
 */
function extractRootPagination(root: RemoteExpandProperty):
  | {
      skip?: number
      take?: number | null
      withMetadata: boolean
    }
  | undefined {
  if (!root.args?.length) {
    return undefined
  }

  const aliases: Record<string, "skip" | "take" | "cursor"> = {
    skip: "skip",
    offset: "skip",
    take: "take",
    limit: "take",
    cursor: "cursor",
  }

  const captured: { skip?: number; take?: number | null } = {}
  let found = false
  let withMetadata = false

  root.args = root.args.filter((arg) => {
    const target = aliases[arg.name]
    if (!target) {
      return true
    }

    found = true
    if (target === "skip" || target === "cursor") {
      withMetadata = true
    }
    if (target !== "cursor") {
      captured[target] = arg.value
    }
    return false
  })

  return found ? { ...captured, withMetadata } : undefined
}

/**
 * Prunes a record to the requested fields, recursively for nested expands.
 */
export function filterFields(
  data: any,
  fields?: string[],
  expands?: RemoteNestedExpands
): Record<string, unknown> | undefined {
  if (!fields || !data) {
    return data
  }

  let filteredData: Record<string, unknown> = {}

  if (fields.includes("*")) {
    filteredData = data
  } else {
    filteredData = fields.reduce((acc: any, field: string) => {
      const fieldValue = data?.[field]
      if (isDefined(fieldValue)) {
        acc[field] = data?.[field]
      }
      return acc
    }, {})
  }

  if (expands) {
    for (const key of Object.keys(expands)) {
      const expand = expands[key]
      if (!expand) {
        continue
      }

      if (Array.isArray(data[key])) {
        filteredData[key] = data[key].map((item: any) =>
          filterFields(item, expand.fields, expand.expands)
        )
      } else {
        const filtered = filterFields(data[key], expand.fields, expand.expands)
        if (isDefined(filtered)) {
          filteredData[key] = filtered
        }
      }
    }
  }

  return (Object.keys(filteredData).length && filteredData) || undefined
}

async function fetchData(params: {
  dataFetcher: IRemoteDataFetcher
  expand: RemoteExpandProperty
  pkField: string
  ids?: (unknown | unknown[])[]
  relationship?: any
  options?: RemoteJoinerOptions
}): Promise<{
  data: unknown[] | { [path: string]: unknown }
  path?: string
}> {
  const { dataFetcher, expand, pkField, ids, relationship, options } = params

  let uniqueIds: unknown[] | undefined
  if (ids != null) {
    const isIdsUsingOperatorMap =
      isObject(ids) && Object.keys(ids).some((key) => !!FilterOperatorMap[key])
    uniqueIds = isIdsUsingOperatorMap ? ids : Array.isArray(ids) ? ids : [ids]
    uniqueIds = Array.isArray(uniqueIds)
      ? uniqueIds.filter((id) => id != null)
      : uniqueIds
  }

  if (uniqueIds && Array.isArray(uniqueIds)) {
    const isCompositeKey = Array.isArray(uniqueIds[0])
    if (isCompositeKey) {
      const seen = new Set()
      uniqueIds = uniqueIds.filter((idArray) => {
        const key = JSON.stringify(idArray)
        const isNew = !seen.has(key)
        seen.add(key)
        return isNew
      })
    } else {
      uniqueIds = Array.from(new Set(uniqueIds.flat()))
    }
  }

  let pkFieldAdjusted = pkField
  if (relationship) {
    pkFieldAdjusted = relationship.inverse
      ? relationship.foreignKey.split(".").pop()!
      : relationship.primaryKey
  }

  const response = await dataFetcher.fetch(
    expand,
    pkFieldAdjusted,
    uniqueIds,
    relationship
  )

  const isObj = isDefined(response.path)
  let resData = isObj ? response.data[response.path!] : response.data

  resData = isDefined(resData)
    ? Array.isArray(resData)
      ? resData
      : [resData]
    : []

  checkIfKeysExist({
    uniqueIds,
    resData,
    expand,
    pkField: pkFieldAdjusted,
    relationship,
    options,
  })

  const filteredDataArray = resData.map((row: any) =>
    filterFields(row, expand.fields, expand.expands)
  )

  if (isObj) {
    response.data[response.path!] = filteredDataArray
  } else {
    response.data = filteredDataArray
  }

  return response
}

function checkIfKeysExist(params: {
  uniqueIds: unknown[] | undefined
  resData: any[]
  expand: RemoteExpandProperty
  pkField: string
  relationship?: any
  options?: RemoteJoinerOptions
}) {
  const { uniqueIds, resData, expand, pkField, relationship, options } = params

  if (
    !(
      isDefined(uniqueIds) &&
      ((options?.throwIfKeyNotFound && !isDefined(relationship)) ||
        (options?.throwIfRelationNotFound && isDefined(relationship)))
    )
  ) {
    return
  }

  if (isDefined(relationship)) {
    if (
      Array.isArray(options?.throwIfRelationNotFound) &&
      !options?.throwIfRelationNotFound.includes(relationship.serviceName)
    ) {
      return
    }
  }

  const notFound = new Set(uniqueIds)
  resData.forEach((data) => {
    notFound.delete(data[pkField])
  })

  if (notFound.size > 0) {
    const entityName =
      expand.serviceConfig.entity ??
      expand.serviceConfig.args?.methodSuffix ??
      expand.serviceConfig.serviceName

    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `${entityName} ${pkField} not found: ` + Array.from(notFound).join(", ")
    )
  }
}

async function handleExpands(params: {
  items: any[]
  plan: QueryPlan
  dataFetcher: IRemoteDataFetcher
  catalog: GraphCatalog
}): Promise<void> {
  const { items, plan, dataFetcher, catalog } = params
  const { expands: parsedExpands, shortcuts, options } = plan

  const root = parsedExpands.get(BASE_PATH)!
  const executionStages = root.executionStages ?? []
  // Skip root stage (depth 0)
  const stages = executionStages.slice(1)

  for (const stage of stages) {
    const stageFetchGroups: {
      ctxs: PathCtx[]
      relationship: ComputedJoinerRelationship
      promise: ReturnType<typeof fetchData>
    }[] = []

    for (const { paths } of stage) {
      const pathCtx: PathCtx[] = []

      for (const path of paths) {
        const expand = parsedExpands.get(path)!
        const nestedItems = getItemsForPath(items, path)

        if (!nestedItems?.length || !expand) {
          continue
        }

        const relationship = catalog.getEntityRelationship({
          parentServiceConfig: expand.parentConfig!,
          property: expand.property,
          entity: expand.entity,
        })

        if (!relationship) {
          continue
        }

        const { field, fieldsArray, idsToFetch } = computeIdsForRelationship(
          nestedItems,
          relationship
        )

        pathCtx.push({
          path,
          expand,
          relationship,
          nestedItems,
          field,
          fieldsArray,
          ids: idsToFetch,
        })
      }

      if (!pathCtx.length) {
        continue
      }

      const byPkField = new Map<string, PathCtx[]>()
      for (const ctx of pathCtx) {
        if (!byPkField.has(ctx.field)) {
          byPkField.set(ctx.field, [])
        }
        byPkField.get(ctx.field)!.push(ctx)
      }

      for (const [pkField, ctxs] of byPkField.entries()) {
        const unionIds: any[] = Array.from(
          new Set(ctxs.flatMap((c) => Array.from(c.ids)))
        )
        const unionFields = Array.from(
          new Set(ctxs.flatMap((c) => c.expand.fields ?? []))
        )
        const unionArgs = ctxs.flatMap((c) => c.expand.args ?? [])

        const base = ctxs[0].expand
        const aggExpand: RemoteExpandProperty = {
          ...base,
          fields: unionFields,
        }
        if (unionArgs.length) {
          aggExpand.args = unionArgs
        }

        const relationship = ctxs[0].relationship
        const promise = fetchData({
          dataFetcher,
          expand: aggExpand,
          pkField,
          ids: unionIds,
          relationship,
          options,
        })

        stageFetchGroups.push({ ctxs, relationship, promise })
      }
    }

    const stageResults = await Promise.all(
      stageFetchGroups.map((g) => g.promise)
    )

    for (let i = 0; i < stageFetchGroups.length; i++) {
      const { ctxs, relationship } = stageFetchGroups[i]
      const relatedDataArray = stageResults[i]

      const joinFields = relationship.inverse
        ? relationship.foreignKeyArr
        : relationship.primaryKeyArr

      const relData = relatedDataArray.path
        ? (relatedDataArray.data as any)[relatedDataArray.path!]
        : relatedDataArray.data

      const relatedDataMap = createRelatedDataMap(relData, joinFields)

      for (const ctx of ctxs) {
        assignRelatedToItems({
          items: ctx.nestedItems,
          relationship: ctx.relationship,
          relatedDataMap,
          field: ctx.field,
          fieldsArray: ctx.fieldsArray,
        })
      }
    }
  }

  if (shortcuts.length > 0) {
    applyShortcuts({
      items,
      parsedExpands,
      shortcuts,
    })
  }
}

/**
 * Post-join result shaping: collapse fieldAlias shortcuts onto their short
 * names and hide intermediate nodes that existed only for the rewrite.
 */
function applyShortcuts(params: {
  items: any[]
  parsedExpands: Map<string, RemoteExpandProperty>
  shortcuts: ShortcutSpec[]
}): void {
  const { items, parsedExpands, shortcuts } = params

  const getChildren = (item: any, prop: string) => {
    if (Array.isArray(item)) {
      return item.flatMap((currentItem) => currentItem[prop])
    }
    return item[prop]
  }

  const removeChildren = (item: any, prop: string) => {
    if (Array.isArray(item)) {
      for (let i = 0; i < item.length; i++) {
        Object.defineProperty(item[i], prop, {
          value: undefined,
          enumerable: false,
        })
      }
    } else {
      Object.defineProperty(item, prop, {
        value: undefined,
        enumerable: false,
      })
    }
  }

  const cleanup: [any, string][] = []

  for (const alias of shortcuts) {
    const propPath = alias.path.slice(alias.location.length)

    let itemsLocation = items
    for (const locationProp of alias.location) {
      itemsLocation = getNestedItems(itemsLocation, locationProp)
    }

    itemsLocation.forEach((locationItem) => {
      if (!locationItem) {
        return
      }

      let currentItems = locationItem
      let parentRemoveItems: any = null

      const curPath: string[] = [BASE_PATH].concat(alias.location)
      for (const prop of propPath) {
        if (!isDefined(currentItems)) {
          break
        }

        curPath.push(prop)

        const config = parsedExpands.get(curPath.join("."))
        if (config?.isAliasMapping && parentRemoveItems === null) {
          parentRemoveItems = [currentItems, prop]
        }

        currentItems = getChildren(currentItems, prop)
      }

      if (Array.isArray(currentItems)) {
        if (currentItems.length < 2 && !alias.isList) {
          locationItem[alias.property] = currentItems.shift()
        } else {
          locationItem[alias.property] = currentItems
        }
      } else {
        locationItem[alias.property] = alias.isList
          ? isDefined(currentItems)
            ? [currentItems]
            : []
          : currentItems
      }

      if (parentRemoveItems !== null) {
        cleanup.push(parentRemoveItems)
      }
    })
  }

  for (const [remItems, path] of cleanup) {
    removeChildren(remItems, path)
  }
}

function getItemsForPath(rootItems: any[], fullPath: string) {
  let nestedItems = rootItems
  const expandedPathLevels = fullPath.split(".")

  for (let idx = 1; idx < expandedPathLevels.length - 1; idx++) {
    nestedItems = getNestedItems(nestedItems, expandedPathLevels[idx])
  }

  return nestedItems
}

function computeIdsForRelationship(
  items: any[],
  relationship: ComputedJoinerRelationship
): {
  field: string
  fieldsArray: string[]
  idsToFetch: Set<any>
} {
  const field = relationship.inverse
    ? relationship.primaryKey
    : relationship.foreignKey.split(".").pop()!

  const fieldsArray = relationship.inverse
    ? relationship.primaryKeyArr
    : relationship.foreignKeyArr

  const idsToFetch: Set<any> = new Set()
  for (const item of items) {
    if (!item) {
      continue
    }
    const values = fieldsArray.map((f) => item?.[f])

    if (fieldsArray.length === 1) {
      const val = values[0]
      if (Array.isArray(val)) {
        for (const v of val) {
          idsToFetch.add(v)
        }
      } else {
        idsToFetch.add(val)
      }
    } else {
      idsToFetch.add(values)
    }
  }

  return { field, fieldsArray, idsToFetch }
}

function createRelatedDataMap(
  relatedDataArray: any[],
  joinFields: string[]
): Record<string, any> {
  return relatedDataArray.reduce((acc, data) => {
    const joinValues = joinFields.map((field) => data[field])
    const key = joinValues.length === 1 ? joinValues[0] : joinValues.join(",")

    let isArray = Array.isArray(acc[key])
    if (isDefined(acc[key]) && !isArray) {
      acc[key] = [acc[key]]
      isArray = true
    }

    if (isArray) {
      acc[key].push(data)
    } else {
      acc[key] = data
    }
    return acc
  }, {})
}

function assignRelatedToItems(params: {
  items: any[]
  relationship: ComputedJoinerRelationship
  relatedDataMap: Record<string, any>
  field: string
  fieldsArray: string[]
}): void {
  const { items, relationship, relatedDataMap, field, fieldsArray } = params

  for (const item of items) {
    if (!item) {
      continue
    }

    const itemKey = fieldsArray.map((f) => item[f]).join(",")

    if (item[relationship.alias]) {
      if (Array.isArray(item[field])) {
        for (let i = 0; i < item[relationship.alias].length; i++) {
          const it = item[relationship.alias][i]
          item[relationship.alias][i] = Object.assign(
            it,
            relatedDataMap[it[relationship.primaryKey]]
          )
        }
        continue
      }

      item[relationship.alias] = Object.assign(
        item[relationship.alias],
        relatedDataMap[itemKey]
      )
      continue
    }

    if (Array.isArray(item[field])) {
      item[relationship.alias] = item[field].map((id) => {
        if (relationship.isList && !Array.isArray(relatedDataMap[id])) {
          relatedDataMap[id] = isDefined(relatedDataMap[id])
            ? [relatedDataMap[id]]
            : []
        }
        return relatedDataMap[id]
      })
    } else {
      if (relationship.isList && !Array.isArray(relatedDataMap[itemKey])) {
        relatedDataMap[itemKey] = isDefined(relatedDataMap[itemKey])
          ? [relatedDataMap[itemKey]]
          : []
      }
      item[relationship.alias] = relatedDataMap[itemKey]
    }
  }
}

function mergeInitialData(params: {
  items: any[]
  initialData: any[]
  serviceConfig: InternalJoinerServiceConfig
  expands?: RemoteNestedExpands
  relationship?: JoinerRelationship
  catalog: GraphCatalog
}): any[] {
  const { items, initialData, serviceConfig, expands, relationship, catalog } =
    params

  if (!initialData.length || !relationship) {
    return items
  }

  const primaryKeys = relationship?.primaryKey.split(",") || [
    serviceConfig.primaryKeys[0],
  ]
  const expandKeys = Object.keys(expands ?? {})

  const initialDataIndexMap = new Map(
    initialData.map((dt, index) => [
      primaryKeys.map((key) => dt[key]).join(","),
      index,
    ])
  )
  const itemMap = new Map(
    items.map((item) => [primaryKeys.map((key) => item[key]).join(","), item])
  )

  const orderedMergedItems = new Array(initialData.length)
  for (const [key, index] of initialDataIndexMap.entries()) {
    const iniData = initialData[index]
    const item = itemMap.get(key)

    if (!item) {
      orderedMergedItems[index] = iniData
      continue
    }

    const shallowProperty = { ...iniData }
    for (const expandKey of expandKeys) {
      const isRel = !!catalog.getEntityRelationship({
        parentServiceConfig: serviceConfig,
        property: expandKey,
      })
      if (isRel) {
        Object.defineProperty(shallowProperty, expandKey, {
          value: undefined,
          enumerable: false,
        })
      }
    }

    Object.assign(item, shallowProperty)
    orderedMergedItems[index] = item
  }

  if (expands) {
    for (const expand of expandKeys) {
      mergeInitialData({
        items: items.flatMap((dt) => dt[expand] ?? []),
        initialData: initialData
          .flatMap((dt) => dt[expand] ?? [])
          .filter(isDefined),
        serviceConfig,
        expands: expands[expand]?.expands,
        relationship: catalog.getEntityRelationship({
          parentServiceConfig: serviceConfig,
          property: expand,
        }),
        catalog,
      })
    }
  }

  return orderedMergedItems
}
