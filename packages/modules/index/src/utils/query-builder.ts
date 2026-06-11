import { IndexTypes } from "@medusajs/framework/types"
import {
  isDefined,
  isObject,
  isString,
  unflattenObjectKeys,
} from "@medusajs/framework/utils"
import { Knex } from "@medusajs/framework/mikro-orm/knex"
import { OrderBy, QueryFormat, QueryOptions, Select } from "@types"
import { getPivotTableName, normalizeTableName } from "./normalze-table-name"

const AND_OPERATOR = "$and"
const OR_OPERATOR = "$or"
const NOT_OPERATOR = "$not"

function escapeJsonPathString(val: string): string {
  // Escape for JSONPath string
  return val.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/'/g, "\\'")
}

function buildSafeJsonPathQuery(
  field: string,
  operator: string,
  value: any
): string {
  let jsonPathOperator = operator
  let caseInsensitiveFlag = ""
  if (operator === "=") {
    jsonPathOperator = "=="
  } else if (operator.toUpperCase().includes("LIKE")) {
    jsonPathOperator = "like_regex"

    if (operator.toUpperCase() === "ILIKE") {
      caseInsensitiveFlag = ' flag "i"'
    }
  } else if (operator === "IS") {
    jsonPathOperator = "=="
  } else if (operator === "IS NOT") {
    jsonPathOperator = "!="
  }

  if (typeof value === "string") {
    let val = value
    if (jsonPathOperator === "like_regex") {
      // Convert SQL LIKE wildcards to regex
      val = val.replace(/%/g, ".*").replace(/_/g, ".")
    }
    value = `"${escapeJsonPathString(val)}"`
  } else {
    if ((operator === "IS" || operator === "IS NOT") && value === null) {
      value = "null"
    }
  }

  return `$.${field} ${jsonPathOperator} ${value}${caseInsensitiveFlag}`
}

export const OPERATOR_MAP = {
  $eq: "=",
  $lt: "<",
  $gt: ">",
  $lte: "<=",
  $gte: ">=",
  $ne: "!=",
  $in: "IN",
  $nin: "NOT IN",
  $is: "IS",
  $like: "LIKE",
  $ilike: "ILIKE",
}

export class QueryBuilder {
  #searchVectorColumnName = "document_tsv"

  private readonly structure: Select
  private readonly entityMap: Record<string, any>
  private readonly knex: Knex
  private readonly selector: QueryFormat
  private readonly options?: QueryOptions
  private readonly schema: IndexTypes.SchemaObjectRepresentation
  private readonly allSchemaFields: Set<string>
  private readonly rawConfig?: IndexTypes.IndexQueryConfig<any>
  private readonly requestedFields: {
    [key: string]: any
  }
  private readonly idsOnly?: boolean

  constructor(args: {
    schema: IndexTypes.SchemaObjectRepresentation
    entityMap: Record<string, any>
    knex: Knex
    selector: QueryFormat
    options?: QueryOptions
    rawConfig?: IndexTypes.IndexQueryConfig<any>
    requestedFields: {
      [key: string]: any
    }
    idsOnly?: boolean
  }) {
    this.schema = args.schema
    this.entityMap = args.entityMap
    this.selector = args.selector
    this.options = args.options
    this.knex = args.knex
    this.structure = this.selector.select
    this.allSchemaFields = new Set(
      Object.values(this.schema).flatMap((entity) => entity.fields ?? [])
    )
    this.rawConfig = args.rawConfig
    this.requestedFields = args.requestedFields
    this.idsOnly = args.idsOnly ?? false
  }

  private isLogicalOperator(key: string) {
    return key === AND_OPERATOR || key === OR_OPERATOR || key === NOT_OPERATOR
  }

  private getStructureKeys(structure) {
    const collectKeys = (obj: any, keys = new Set<string>()) => {
      if (!isObject(obj)) {
        return keys
      }

      Object.keys(obj).forEach((key) => {
        if (this.isLogicalOperator(key)) {
          if (Array.isArray(obj[key])) {
            obj[key].forEach((item) => collectKeys(item, keys))
          }
        } else if (key !== "entity") {
          keys.add(key)
        }
      })

      return keys
    }

    return [...collectKeys(structure ?? {})]
  }

  private getEntity(
    path,
    throwWhenNotFound = true
  ): IndexTypes.SchemaPropertiesMap[0] | undefined {
    if (!this.schema._schemaPropertiesMap[path]) {
      if (!throwWhenNotFound) {
        return
      }

      throw new Error(
        `Could not find entity for path: ${path}. It might not be indexed.`
      )
    }

    return this.schema._schemaPropertiesMap[path]
  }

  private getGraphQLType(path, field) {
    if (this.isLogicalOperator(field)) {
      return "JSON"
    }

    const entity = this.getEntity(path)?.ref?.entity!
    const fieldRef = this.entityMap[entity]._fields[field]

    if (!fieldRef) {
      throw new Error(`Field ${field} is not indexed.`)
    }

    const fieldType = fieldRef.type.toString()
    const isArray = fieldType.startsWith("[")
    const currentType = fieldType.replace(/\[|\]|\!/g, "")
    return currentType + (isArray ? "[]" : "")
  }

  private transformValueToType(path, field, value) {
    if (value === null) {
      return null
    }

    const typeToFn = {
      Int: (val) => parseInt(val, 10),
      Float: (val) => parseFloat(val),
      String: (val) => String(val),
      Boolean: (val) => Boolean(val),
      ID: (val) => String(val),
      Date: (val) => new Date(val).toISOString(),
      DateTime: (val) => new Date(val).toISOString(),
      Time: (val) => new Date(`1970-01-01T${val}Z`).toISOString(),
    }

    const fullPath = [path, ...field]
    const prop = fullPath.pop()
    const fieldPath = fullPath.join(".")
    const graphqlType = this.getGraphQLType(fieldPath, prop).replace("[]", "")

    const fn = typeToFn[graphqlType]
    if (Array.isArray(value)) {
      return value.map((v) => (!fn ? v : fn(v)))
    }
    return !fn ? value : fn(value)
  }

  private getPostgresCastType(path, field) {
    const graphqlToPostgresTypeMap = {
      Int: "::int",
      Float: "::double precision",
      Boolean: "::boolean",
      Date: "::timestamp",
      DateTime: "::timestamp",
      Time: "::time",
      "": "",
    }

    const defaultValues = {
      Int: "0",
      Float: "0",
      Boolean: "false",
      Date: "1970-01-01 00:00:00",
      DateTime: "1970-01-01 00:00:00",
      Time: "00:00:00",
      "": "",
    }

    const fullPath = [path, ...field]
    const prop = fullPath.pop()
    const fieldPath = fullPath.join(".")
    let graphqlType = this.getGraphQLType(fieldPath, prop)
    const isList = graphqlType.endsWith("[]")
    graphqlType = graphqlType.replace("[]", "")

    const cast =
      (graphqlToPostgresTypeMap[graphqlType] ?? "") + (isList ? "[]" : "")

    function generateCoalesceExpression(field) {
      const defaultValue = defaultValues[graphqlType]
      return `COALESCE(${field}, '${defaultValue}')${cast}`
    }

    return {
      cast,
      coalesce: generateCoalesceExpression,
    }
  }

  private parseWhere(
    aliasMapping: { [path: string]: string },
    obj: object,
    builder: Knex.QueryBuilder,
    parentPath: string = ""
  ) {
    const keys = Object.keys(obj)

    const getPathAndField = (key: string) => {
      const fullKey = parentPath ? `${parentPath}.${key}` : key
      const path = fullKey.split(".")
      const field = [path.pop()]

      while (!aliasMapping[path.join(".")] && path.length > 0) {
        field.unshift(path.pop())
      }

      const attr = path.join(".")

      return { field, attr }
    }

    const getPathOperation = (
      attr: string,
      path: string[],
      value: unknown
    ): string => {
      const partialPath = path.length > 1 ? path.slice(0, -1) : path
      const val = this.transformValueToType(attr, partialPath, value)
      const result = path.reduceRight((acc, key) => {
        return { [key]: acc }
      }, val)

      return JSON.stringify(result)
    }

    keys.forEach((key) => {
      const pathAsArray = (parentPath ? `${parentPath}.${key}` : key).split(".")
      const fieldOrLogicalOperator = pathAsArray.pop()!
      let value = obj[key]

      if (
        this.isLogicalOperator(fieldOrLogicalOperator) &&
        !Array.isArray(value)
      ) {
        value = [value]
      }

      if (fieldOrLogicalOperator === AND_OPERATOR && Array.isArray(value)) {
        builder.where((qb) => {
          value.forEach((cond) => {
            qb.andWhere((subBuilder) =>
              this.parseWhere(
                aliasMapping,
                cond,
                subBuilder,
                pathAsArray.join(".")
              )
            )
          })
        })
      } else if (
        fieldOrLogicalOperator === OR_OPERATOR &&
        Array.isArray(value)
      ) {
        builder.where((qb) => {
          value.forEach((cond) => {
            qb.orWhere((subBuilder) =>
              this.parseWhere(
                aliasMapping,
                cond,
                subBuilder,
                pathAsArray.join(".")
              )
            )
          })
        })
      } else if (
        fieldOrLogicalOperator === NOT_OPERATOR &&
        (Array.isArray(value) || isObject(value))
      ) {
        builder.whereNot((qb) => {
          if (Array.isArray(value)) {
            value.forEach((cond) => {
              qb.andWhere((subBuilder) =>
                this.parseWhere(
                  aliasMapping,
                  cond,
                  subBuilder,
                  pathAsArray.join(".")
                )
              )
            })
          } else {
            this.parseWhere(
              aliasMapping,
              value as any,
              qb,
              pathAsArray.join(".")
            )
          }
        })
      } else if (
        isObject(value) &&
        !Array.isArray(value) &&
        !this.isLogicalOperator(fieldOrLogicalOperator)
      ) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key

        const subKeys = Object.keys(value)
        const hasOperators = subKeys.some((subKey) => OPERATOR_MAP[subKey])

        if (hasOperators) {
          const { field, attr } = getPathAndField(key)

          const subKeys = Object.keys(value)
          subKeys.forEach((subKey) => {
            let operator = OPERATOR_MAP[subKey]
            if (operator) {
              const nested = new Array(field.length).join("->?")

              const subValue = this.transformValueToType(
                attr,
                field,
                value[subKey]
              )

              let val =
                operator === "IN" || operator === "NOT IN"
                  ? subValue
                  : [subValue]
              if (operator === "=" && subValue === null) {
                operator = "IS"
              } else if (operator === "!=" && subValue === null) {
                operator = "IS NOT"
              }

              if (operator === "=") {
                const hasId = field[field.length - 1] === "id"
                if (hasId) {
                  builder.whereRaw(`${aliasMapping[attr]}.id = ?`, subValue)
                } else {
                  builder.whereRaw(
                    `${aliasMapping[attr]}.data @> ?::jsonb`,
                    [getPathOperation(attr, field as string[], subValue)]
                  )
                }
              } else if (operator === "IN" || operator === "NOT IN") {
                if (val && !Array.isArray(val)) {
                  val = [val]
                }
                if (!val || val.length === 0) {
                  return
                }

                const inPlaceholders = val.map(() => "?").join(",")
                const hasId = field[field.length - 1] === "id"
                const isNegated = operator === "NOT IN"
                if (hasId) {
                  builder.whereRaw(
                    `${aliasMapping[attr]}.id ${
                      isNegated ? "NOT IN" : "IN"
                    } (${inPlaceholders})`,
                    val
                  )
                } else {
                  const targetField = field[field.length - 1] as string

                  const jsonbValues = val.map((item) =>
                    JSON.stringify({
                      [targetField]: item === null ? null : item,
                    })
                  )

                  if (isNegated) {
                    builder.whereRaw(
                      `NOT EXISTS (SELECT 1 FROM unnest(ARRAY[${inPlaceholders}]::JSONB[]) AS v(val) WHERE ${aliasMapping[attr]}.data${nested} @> v.val)`,
                      jsonbValues
                    )
                  } else {
                    builder.whereRaw(
                      `${aliasMapping[attr]}.data${nested} @> ANY(ARRAY[${inPlaceholders}]::JSONB[])`,
                      jsonbValues
                    )
                  }
                }
              } else {
                const potentialIdFields = field[field.length - 1]
                const hasId = potentialIdFields === "id"

                if (hasId) {
                  builder.whereRaw(`(${aliasMapping[attr]}.id) ${operator} ?`, [
                    ...val,
                  ])
                } else {
                  const targetField = field[field.length - 1] as string

                  const jsonPath = buildSafeJsonPathQuery(
                    targetField,
                    operator,
                    val[0]
                  )

                  builder.whereRaw(`${aliasMapping[attr]}.data${nested} @@ ?`, [
                    jsonPath,
                  ])
                }
              }
            } else {
              throw new Error(`Unsupported operator: ${subKey}`)
            }
          })
        } else {
          this.parseWhere(aliasMapping, value, builder, currentPath)
        }
      } else {
        const { field, attr } = getPathAndField(key)
        const nested = new Array(field.length).join("->?")

        value = this.transformValueToType(attr, field, value)
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return
          }

          const inPlaceholders = value.map(() => "?").join(",")
          const hasId = field[field.length - 1] === "id"
          if (hasId) {
            builder.whereRaw(
              `${aliasMapping[attr]}.id IN (${inPlaceholders})`,
              [...value]
            )
          } else {
            const targetField = field[field.length - 1] as string

            const jsonbValues = value.map((item) =>
              JSON.stringify({ [targetField]: item === null ? null : item })
            )
            builder.whereRaw(
              `${aliasMapping[attr]}.data${nested} @> ANY(ARRAY[${inPlaceholders}]::JSONB[])`,
              jsonbValues
            )
          }
        } else if (isDefined(value)) {
          let operator = "="

          if (operator === "=") {
            const hasId = field[field.length - 1] === "id"
            if (hasId) {
              builder.whereRaw(`${aliasMapping[attr]}.id = ?`, value)
            } else {
              builder.whereRaw(
                `${aliasMapping[attr]}.data @> ?::jsonb`,
                [getPathOperation(attr, field as string[], value)]
              )
            }
          } else {
            if (value === null) {
              operator = "IS"
            }

            const hasId = field[field.length - 1] === "id"
            if (hasId) {
              builder.whereRaw(`(${aliasMapping[attr]}.id) ${operator} ?`, [
                value,
              ])
            } else {
              const targetField = field[field.length - 1] as string

              const jsonPath = buildSafeJsonPathQuery(
                targetField,
                operator,
                value
              )
              builder.whereRaw(`${aliasMapping[attr]}.data${nested} @@ ?`, [
                jsonPath,
              ])
            }
          }
        }
      }
    })

    return builder
  }

  private getShortAlias(aliasMapping, alias, level = 0) {
    aliasMapping.__aliasIndex ??= 0

    if (aliasMapping[alias]) {
      return aliasMapping[alias]
    }

    aliasMapping[alias] =
      "t_" + aliasMapping.__aliasIndex++ + (level > 0 ? `_${level}` : "")

    return aliasMapping[alias]
  }

  private buildQueryParts(
    structure: Select,
    parentAlias: string,
    parentEntity: IndexTypes.SchemaObjectEntityRepresentation["parents"][0],
    parentProperty: string,
    aliasPath: string[] = [],
    level = 0,
    aliasMapping: { [path: string]: string } = {}
  ): string[] {
    const currentAliasPath = [...aliasPath, parentProperty].join(".")

    const isSelectableField = this.allSchemaFields.has(parentProperty)
    const entities = this.getEntity(currentAliasPath, false)

    // !entityRef.alias means the object has not table, it's a nested object
    if (isSelectableField || !entities || !entities?.ref?.alias) {
      // We are currently selecting a specific field of the parent entity or the entity is not found on the index schema
      // We don't need to build the query parts for this as there is no join
      return []
    }

    const mainEntity = entities
    const mainAlias = this.getShortAlias(
      aliasMapping,
      mainEntity.ref.entity.toLowerCase(),
      level
    )

    const allEntities: {
      entity: IndexTypes.SchemaPropertiesMap[0]
      parEntity: IndexTypes.SchemaObjectEntityRepresentation["parents"][0]
      parAlias: string
      alias: string
    }[] = []
    if (!entities.shortCutOf) {
      allEntities.push({
        entity: entities,
        parEntity: parentEntity,
        parAlias: parentAlias,
        alias: mainAlias,
      })
    } else {
      const intermediateAlias = entities.shortCutOf.split(".")

      for (let i = intermediateAlias.length - 1, x = 0; i >= 0; i--, x++) {
        const intermediateEntity = this.getEntity(
          intermediateAlias.join("."),
          false
        )
        if (!intermediateEntity) {
          break
        }

        intermediateAlias.pop()

        if (intermediateEntity.ref.entity === parentEntity?.ref.entity) {
          break
        }

        const parentIntermediateEntity = this.getEntity(
          intermediateAlias.join(".")
        )!

        const alias =
          this.getShortAlias(
            aliasMapping,
            intermediateEntity.ref.entity.toLowerCase(),
            level
          ) +
          "_" +
          x

        const parAlias =
          parentIntermediateEntity.ref.entity === parentEntity?.ref.entity
            ? parentAlias
            : this.getShortAlias(
                aliasMapping,
                parentIntermediateEntity.ref.entity.toLowerCase(),
                level
              ) +
              "_" +
              (x + 1)

        if (x === 0) {
          aliasMapping[currentAliasPath] = alias
        }

        allEntities.unshift({
          entity: intermediateEntity as any,
          parEntity:
            parentIntermediateEntity as IndexTypes.SchemaObjectEntityRepresentation["parents"][0],
          parAlias,
          alias,
        })
      }
    }

    let queryParts: string[] = []
    for (const join of allEntities) {
      const joinBuilder = this.knex.queryBuilder()
      const { alias, entity, parEntity, parAlias } = join

      aliasMapping[currentAliasPath] = alias

      if (level > 0) {
        const cName = normalizeTableName(entity.ref.entity)

        let joinTable = `cat_${cName} AS ${alias}`

        if (entity.isInverse || parEntity.isInverse) {
          const pName =
            `${entity.ref.entity}${parEntity.ref.entity}`.toLowerCase()
          const pivotTable = getPivotTableName(pName)

          joinBuilder.leftJoin(
            `${pivotTable} AS ${alias}_ref`,
            `${alias}_ref.child_id`,
            `${parAlias}.id`
          )
          joinBuilder.leftJoin(
            joinTable,
            `${alias}.id`,
            `${alias}_ref.parent_id`
          )
        } else {
          const pName =
            `${parEntity.ref.entity}${entity.ref.entity}`.toLowerCase()
          const pivotTable = getPivotTableName(pName)

          joinBuilder.leftJoin(
            `${pivotTable} AS ${alias}_ref`,
            `${alias}_ref.parent_id`,
            `${parAlias}.id`
          )
          joinBuilder.leftJoin(
            joinTable,
            `${alias}.id`,
            `${alias}_ref.child_id`
          )
        }

        const joinWhere = this.selector.joinWhere ?? {}
        const joinKey = Object.keys(joinWhere).find((key) => {
          const k = key.split(".")
          k.pop()
          const curPath = k.join(".")
          if (curPath === currentAliasPath) {
            const relEntity = this.getEntity(curPath, false)
            return relEntity?.ref?.entity === entity.ref.entity
          }

          return false
        })

        if (joinKey) {
          this.parseWhere(
            aliasMapping,
            { [joinKey]: joinWhere[joinKey] },
            joinBuilder
          )
        }

        queryParts.push(
          joinBuilder.toQuery().replace("select * ", "").replace("where", "and")
        )
      }
    }

    const children = this.getStructureKeys(structure)
    for (const child of children) {
      const childStructure = structure[child] as Select
      queryParts = queryParts
        .concat(
          this.buildQueryParts(
            childStructure,
            mainAlias,
            mainEntity as any,
            child,
            aliasPath.concat(parentProperty),
            level + 1,
            aliasMapping
          )
        )
        .filter(Boolean)
    }

    return queryParts
  }

  private buildSelectParts(
    structure: Select,
    parentProperty: string,
    aliasMapping: { [path: string]: string },
    aliasPath: string[] = [],
    selectParts: object = {}
  ): object {
    const currentAliasPath = [...aliasPath, parentProperty].join(".")

    const isSelectableField = this.allSchemaFields.has(parentProperty)
    if (isSelectableField) {
      // We are currently selecting a specific field of the parent entity
      // Let's remove the parent alias from the select parts to not select everything entirely
      // and add the specific field to the select parts
      const parentAliasPath = aliasPath.join(".")
      const alias = aliasMapping[parentAliasPath]
      delete selectParts[parentAliasPath]

      if (parentProperty === "id") {
        selectParts[currentAliasPath] = `${alias}.id`
      } else if (!this.idsOnly) {
        selectParts[currentAliasPath] = this.knex.raw(
          `${alias}.data->'${parentProperty}'`
        )
      }
      return selectParts
    }

    const alias = aliasMapping[currentAliasPath]
    // If the entity is not found in the schema (not indexed), we don't need to build the select parts
    if (!alias) {
      return selectParts
    }

    if (!this.idsOnly) {
      selectParts[currentAliasPath] = `${alias}.data`
    }

    selectParts[currentAliasPath + ".id"] = `${alias}.id`

    const children = this.getStructureKeys(structure)
    for (const child of children) {
      const childStructure = structure[child] as Select

      this.buildSelectParts(
        childStructure,
        child,
        aliasMapping,
        aliasPath.concat(parentProperty),
        selectParts
      )
    }

    return selectParts
  }

  private transformOrderBy(arr: (object | string)[]): OrderBy {
    const result = {}
    const map = new Map()
    map.set(true, "ASC")
    map.set(1, "ASC")
    map.set("ASC", "ASC")
    map.set(false, "DESC")
    map.set(-1, "DESC")
    map.set("DESC", "DESC")

    function nested(obj, prefix = "") {
      const keys = Object.keys(obj)
      if (!keys.length) {
        return
      } else if (keys.length > 1) {
        throw new Error("Order by only supports one key per object.")
      }
      const key = keys[0]
      let value = obj[key]
      if (isObject(value)) {
        nested(value, prefix + key + ".")
      } else {
        if (isString(value)) {
          value = value.toUpperCase()
        }
        result[prefix + key] = map.get(value) ?? "ASC"
      }
    }
    arr.forEach((obj) => nested(obj))

    return result
  }

  public buildQuery({
    hasPagination = true,
    hasCount = false,
  }: {
    hasPagination?: boolean
    hasCount?: boolean
  }): { sql: string; sqlCount?: string } {
    const selectOnlyStructure = this.selector.select
    const structure = this.requestedFields
    const filter = this.selector.where ?? {}

    const { orderBy: order, skip, take } = this.options ?? {}

    const orderBy = this.transformOrderBy(
      (order && !Array.isArray(order) ? [order] : order) ?? []
    )
    const take_ = !isNaN(+take!) ? +take! : 15
    const skip_ = !isNaN(+skip!) ? +skip! : 0

    const rootKey = this.getStructureKeys(structure)[0]
    const rootStructure = structure[rootKey] as Select

    const entity = this.getEntity(rootKey)!
    const rootEntity = entity.ref.entity.toLowerCase()
    const aliasMapping: { [path: string]: string } = {}

    let hasTextSearch: boolean = false
    let textSearchQuery: string | null = null
    const searchQueryFilterProp = `${rootKey}.q`

    if (searchQueryFilterProp in filter) {
      if (!filter[searchQueryFilterProp]) {
        delete filter[searchQueryFilterProp]
      } else {
        hasTextSearch = true
        textSearchQuery = filter[searchQueryFilterProp]
        delete filter[searchQueryFilterProp]
      }
    }

    const filterSortStructure =
      unflattenObjectKeys({
        ...(this.rawConfig?.filters
          ? unflattenObjectKeys(this.rawConfig?.filters)
          : {}),
        ...orderBy,
      })[rootKey] ?? {}

    const joinParts = this.buildQueryParts(
      filterSortStructure,
      "",
      entity as IndexTypes.SchemaObjectEntityRepresentation["parents"][0],
      rootKey,
      [],
      0,
      aliasMapping
    )

    const rootAlias = aliasMapping[rootKey]

    const innerQueryBuilder = this.knex.queryBuilder()
    // Outer query to select the full data based on the paginated IDs
    const outerQueryBuilder = this.knex.queryBuilder()

    innerQueryBuilder.distinct(`${rootAlias}.id`)

    const orderBySelects: Array<string | Knex.Raw> = []
    const orderByClauses: string[] = []

    for (const aliasPath in orderBy) {
      const path = aliasPath.split(".")
      const field = path.pop()!
      const attr = path.join(".")
      const alias = aliasMapping[attr]
      const direction = orderBy[aliasPath]
      const pgType = this.getPostgresCastType(attr, [field])
      const hasId = field === "id"

      let orderExpression:
        | string
        | Knex.Raw<any> = `${rootAlias}.id ${direction}`

      if (alias) {
        const aggregateAlias = `"${aliasPath}_agg"`
        let aggregateExpression = `(${alias}.data->>'${field}')${pgType.cast}`

        if (hasId) {
          aggregateExpression = `${alias}.id`
        } else {
          orderBySelects.push(
            direction === "ASC"
              ? this.knex.raw(
                  `MIN(${aggregateExpression}) AS ${aggregateAlias}`
                )
              : this.knex.raw(
                  `MAX(${aggregateExpression}) AS ${aggregateAlias}`
                )
          )
          orderExpression = `${aggregateAlias} ${direction}`
        }

        outerQueryBuilder.orderByRaw(`${aggregateExpression} ${direction}`)
      }

      orderByClauses.push(orderExpression as string)
    }

    // Add ordering columns to the select list of the inner query
    if (orderBySelects.length > 0) {
      innerQueryBuilder.select(orderBySelects)
    }

    innerQueryBuilder.from(
      `cat_${normalizeTableName(rootEntity)} AS ${this.getShortAlias(
        aliasMapping,
        rootKey
      )}`
    )

    joinParts.forEach((joinPart) => {
      innerQueryBuilder.joinRaw(joinPart)
    })

    if (hasTextSearch) {
      const searchWhereParts = [
        `${rootAlias}.${
          this.#searchVectorColumnName
        } @@ plainto_tsquery('simple', ?)`,
        ...joinParts.flatMap((part) => {
          const aliases = part
            .split(" as ")
            .flatMap((chunk) => chunk.split(" on "))
            .filter(
              (alias) => alias.startsWith('"t_') && !alias.includes("_ref")
            )
          return aliases.map(
            (alias) =>
              `${alias}.${
                this.#searchVectorColumnName
              } @@ plainto_tsquery('simple', ?)`
          )
        }),
      ]

      innerQueryBuilder.whereRaw(
        `(${searchWhereParts.join(" OR ")})`,
        Array(searchWhereParts.length).fill(textSearchQuery)
      )
    }

    this.parseWhere(aliasMapping, filter, innerQueryBuilder)

    // Group by root ID in the inner query
    if (orderBySelects.length > 0) {
      innerQueryBuilder.groupBy(`${rootAlias}.id`)
    }

    if (orderByClauses.length > 0) {
      innerQueryBuilder.orderByRaw(orderByClauses.join(", "))
    } else {
      innerQueryBuilder.orderBy(`${rootAlias}.id`, "ASC")
    }

    // Count query to estimate the number of results in parallel
    let countQuery: Knex.Raw | undefined
    if (hasCount) {
      const estimateQuery = innerQueryBuilder.clone()
      estimateQuery.clearSelect().select(1)
      estimateQuery.clearOrder()
      estimateQuery.clearCounters()

      countQuery = this.knex.raw(
        `SELECT count_estimate(?) AS estimate_count`,
        estimateQuery.toQuery()
      )
    }

    // Apply pagination to the inner query
    if (hasPagination) {
      innerQueryBuilder.limit(take_)
      if (skip_ > 0) {
        innerQueryBuilder.offset(skip_)
      }
    }

    const innerQueryAlias = "paginated_ids"

    outerQueryBuilder.from(
      `cat_${normalizeTableName(rootEntity)} AS ${this.getShortAlias(
        aliasMapping,
        rootKey
      )}`
    )

    outerQueryBuilder.joinRaw(
      `INNER JOIN (${innerQueryBuilder.toQuery()}) AS ${innerQueryAlias} ON ${rootAlias}.id = ${innerQueryAlias}.id`
    )

    this.parseWhere(aliasMapping, filter, outerQueryBuilder)

    const joinPartsOuterQuery = this.buildQueryParts(
      rootStructure,
      "",
      entity as IndexTypes.SchemaObjectEntityRepresentation["parents"][0],
      rootKey,
      [],
      0,
      aliasMapping
    )
    joinPartsOuterQuery.forEach((joinPart) => {
      outerQueryBuilder.joinRaw(joinPart)
    })

    const finalSelectParts = this.buildSelectParts(
      selectOnlyStructure[rootKey] as Select,
      rootKey,
      aliasMapping
    )

    outerQueryBuilder.select(finalSelectParts)

    const finalSql = outerQueryBuilder.toQuery()

    return {
      sql: finalSql,
      sqlCount: countQuery?.toQuery?.(),
    }
  }

  public buildObjectFromResultset(
    resultSet: Record<string, any>[]
  ): Record<string, any>[] {
    const structure = this.structure
    const rootKey = this.getStructureKeys(structure)[0]

    const maps: { [key: string]: { [id: string]: Record<string, any> } } = {}
    const isListMap: { [path: string]: boolean } = {}
    const referenceMap: { [key: string]: any } = {}
    const pathDetails: {
      [key: string]: {
        property: string
        parents: string[]
        parentPath: string
      }
    } = {}

    const initializeMaps = (structure: Select, path: string[]) => {
      const currentPath = path.join(".")
      const entity = this.getEntity(currentPath, false)
      if (!entity) {
        return
      }

      maps[currentPath] = {}

      if (path.length > 1) {
        const property = path[path.length - 1]
        const parents = path.slice(0, -1)
        const parentPath = parents.join(".")

        // In the case of specific selection
        // We dont need to check if the property is a list
        const isSelectableField = this.allSchemaFields.has(property)
        if (isSelectableField) {
          pathDetails[currentPath] = { property, parents, parentPath }
          isListMap[currentPath] = false
          return
        }

        isListMap[currentPath] = !!this.getEntity(
          currentPath,
          false
        )?.ref?.parents?.find((p) => p.targetProp === property)?.isList

        pathDetails[currentPath] = { property, parents, parentPath }
      }

      const children = this.getStructureKeys(structure)
      for (const key of children) {
        initializeMaps(structure[key] as Select, [...path, key])
      }
    }
    initializeMaps(structure[rootKey] as Select, [rootKey])

    function buildReferenceKey(
      path: string[],
      id: string,
      row: Record<string, any>
    ) {
      let current = ""
      let key = ""
      for (const p of path) {
        current += `${p}`
        key += row[`${current}.id`] + "."
        current += "."
      }
      return key + id
    }

    const columnMap = {}
    const columnNames = Object.keys(resultSet[0] ?? {})
    for (const property of columnNames) {
      const segments = property.split(".")
      const field = segments.pop()
      const parent = segments.join(".")

      columnMap[parent] ??= []
      columnMap[parent].push({
        field,
        property,
      })
    }

    resultSet.forEach((row) => {
      for (const path in maps) {
        const id = row[`${path}.id`]

        // root level
        if (!pathDetails[path]) {
          if (!maps[path][id]) {
            maps[path][id] = row[path] || undefined

            // If there is an id, but no object values, it means that specific fields were selected
            // so we recompose the object with all selected fields. (id will always be selected)
            if (!maps[path][id] && id) {
              maps[path][id] = {}
              for (const column of columnMap[path]) {
                maps[path][id][column.field] = row[column.property]
              }
            }
          }
          continue
        }

        const { property, parents, parentPath } = pathDetails[path]
        const referenceKey = buildReferenceKey(parents, id, row)

        if (referenceMap[referenceKey]) {
          continue
        }

        maps[path][id] = row[path] || undefined

        // If there is an id, but no object values, it means that specific fields were selected
        // so we recompose the object with all selected fields. (id will always be selected)
        if (!maps[path][id] && id) {
          maps[path][id] = {}
          for (const column of columnMap[path]) {
            maps[path][id][column.field] = row[column.property]
          }
        }

        const parentObj = maps[parentPath][row[`${parentPath}.id`]]

        if (!parentObj) {
          continue
        }

        const isList = isListMap[parentPath + "." + property]
        if (isList && !Array.isArray(parentObj[property])) {
          parentObj[property] = []
        }

        if (maps[path][id] !== undefined) {
          if (isList) {
            parentObj[property].push(maps[path][id])
          } else {
            parentObj[property] = maps[path][id]
          }
        }

        referenceMap[referenceKey] = true
      }
    })

    return Object.values(maps[rootKey] ?? {})
  }
}
