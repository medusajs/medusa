import { Knex } from "@mikro-orm/knex"
import { IndexTypes } from "@medusajs/framework/types"
import { OrderBy, QueryFormat, QueryOptions, Select } from "@types"
import { isObject, isString, GraphQLUtils } from "@medusajs/framework/utils"

export const OPERATOR_MAP = {
  $eq: "=",
  $lt: "<",
  $gt: ">",
  $lte: "<=",
  $gte: ">=",
  $ne: "!=",
  $in: "IN",
  $is: "IS",
  $like: "LIKE",
  $ilike: "ILIKE",
}

export class QueryBuilder {
  private readonly structure: Select
  private readonly entityMap: Record<string, any>
  private readonly knex: Knex
  private readonly selector: QueryFormat
  private readonly options?: QueryOptions
  private readonly schema: IndexTypes.SchemaObjectRepresentation

  constructor(args: {
    schema: IndexTypes.SchemaObjectRepresentation
    entityMap: Record<string, any>
    knex: Knex
    selector: QueryFormat
    options?: QueryOptions
  }) {
    this.schema = args.schema
    this.entityMap = args.entityMap
    this.selector = args.selector
    this.options = args.options
    this.knex = args.knex
    this.structure = this.selector.select
  }

  private getStructureKeys(structure) {
    return Object.keys(structure ?? {}).filter((key) => key !== "entity")
  }

  private getEntity(path): IndexTypes.SchemaPropertiesMap[0] {
    if (!this.schema._schemaPropertiesMap[path]) {
      throw new Error(`Could not find entity for path: ${path}`)
    }

    return this.schema._schemaPropertiesMap[path]
  }

  private getGraphQLType(path, field) {
    const entity = this.getEntity(path)?.ref?.entity
    const fieldRef = this.entityMap[entity]._fields[field]
    if (!fieldRef) {
      throw new Error(`Field ${field} not found in the entityMap.`)
    }

    let currentType = fieldRef.type
    let isArray = false
    while (currentType.ofType) {
      if (currentType instanceof GraphQLUtils.GraphQLList) {
        isArray = true
      }

      currentType = currentType.ofType
    }

    return currentType.name + (isArray ? "[]" : "")
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
      Time: "::time",
      "": "",
    }

    const fullPath = [path, ...field]
    const prop = fullPath.pop()
    const fieldPath = fullPath.join(".")
    let graphqlType = this.getGraphQLType(fieldPath, prop)
    const isList = graphqlType.endsWith("[]")
    graphqlType = graphqlType.replace("[]", "")

    return (graphqlToPostgresTypeMap[graphqlType] ?? "") + (isList ? "[]" : "")
  }

  private parseWhere(
    aliasMapping: { [path: string]: string },
    obj: object,
    builder: Knex.QueryBuilder
  ) {
    const keys = Object.keys(obj)

    const getPathAndField = (key: string) => {
      const path = key.split(".")
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
      let value = obj[key]

      if ((key === "$and" || key === "$or") && !Array.isArray(value)) {
        value = [value]
      }

      if (key === "$and" && Array.isArray(value)) {
        builder.where((qb) => {
          value.forEach((cond) => {
            qb.andWhere((subBuilder) =>
              this.parseWhere(aliasMapping, cond, subBuilder)
            )
          })
        })
      } else if (key === "$or" && Array.isArray(value)) {
        builder.where((qb) => {
          value.forEach((cond) => {
            qb.orWhere((subBuilder) =>
              this.parseWhere(aliasMapping, cond, subBuilder)
            )
          })
        })
      } else if (isObject(value) && !Array.isArray(value)) {
        const subKeys = Object.keys(value)
        subKeys.forEach((subKey) => {
          let operator = OPERATOR_MAP[subKey]
          if (operator) {
            const { field, attr } = getPathAndField(key)
            const nested = new Array(field.length).join("->?")

            const subValue = this.transformValueToType(
              attr,
              field,
              value[subKey]
            )
            const castType = this.getPostgresCastType(attr, field)

            const val = operator === "IN" ? subValue : [subValue]
            if (operator === "=" && subValue === null) {
              operator = "IS"
            }

            if (operator === "=") {
              builder.whereRaw(
                `${aliasMapping[attr]}.data @> '${getPathOperation(
                  attr,
                  field as string[],
                  subValue
                )}'::jsonb`
              )
            } else {
              builder.whereRaw(
                `(${aliasMapping[attr]}.data${nested}->>?)${castType} ${operator} ?`,
                [...field, ...val]
              )
            }
          } else {
            throw new Error(`Unsupported operator: ${subKey}`)
          }
        })
      } else {
        const { field, attr } = getPathAndField(key)
        const nested = new Array(field.length).join("->?")

        value = this.transformValueToType(attr, field, value)
        if (Array.isArray(value)) {
          const castType = this.getPostgresCastType(attr, field)
          const inPlaceholders = value.map(() => "?").join(",")
          builder.whereRaw(
            `(${aliasMapping[attr]}.data${nested}->>?)${castType} IN (${inPlaceholders})`,
            [...field, ...value]
          )
        } else {
          const operator = value === null ? "IS" : "="

          if (operator === "=") {
            builder.whereRaw(
              `${aliasMapping[attr]}.data @> '${getPathOperation(
                attr,
                field as string[],
                value
              )}'::jsonb`
            )
          } else {
            const castType = this.getPostgresCastType(attr, field)
            builder.whereRaw(
              `(${aliasMapping[attr]}.data${nested}->>?)${castType} ${operator} ?`,
              [...field, value]
            )
          }
        }
      }
    })

    return builder
  }

  private buildQueryParts(
    structure: Select,
    parentAlias: string,
    parentEntity: string,
    parentProperty: string,
    aliasPath: string[] = [],
    level = 0,
    aliasMapping: { [path: string]: string } = {}
  ): string[] {
    const currentAliasPath = [...aliasPath, parentProperty].join(".")

    const entities = this.getEntity(currentAliasPath)

    const mainEntity = entities.ref.entity
    const mainAlias = mainEntity.toLowerCase() + level

    const allEntities: any[] = []
    if (!entities.shortCutOf) {
      allEntities.push({
        entity: mainEntity,
        parEntity: parentEntity,
        parAlias: parentAlias,
        alias: mainAlias,
      })
    } else {
      const intermediateAlias = entities.shortCutOf.split(".")

      for (let i = intermediateAlias.length - 1, x = 0; i >= 0; i--, x++) {
        const intermediateEntity = this.getEntity(intermediateAlias.join("."))

        intermediateAlias.pop()

        if (intermediateEntity.ref.entity === parentEntity) {
          break
        }

        const parentIntermediateEntity = this.getEntity(
          intermediateAlias.join(".")
        )

        const alias =
          intermediateEntity.ref.entity.toLowerCase() + level + "_" + x
        const parAlias =
          parentIntermediateEntity.ref.entity === parentEntity
            ? parentAlias
            : parentIntermediateEntity.ref.entity.toLowerCase() +
              level +
              "_" +
              (x + 1)

        if (x === 0) {
          aliasMapping[currentAliasPath] = alias
        }

        allEntities.unshift({
          entity: intermediateEntity.ref.entity,
          parEntity: parentIntermediateEntity.ref.entity,
          parAlias,
          alias,
        })
      }
    }

    let queryParts: string[] = []
    for (const join of allEntities) {
      const { alias, entity, parEntity, parAlias } = join

      aliasMapping[currentAliasPath] = alias

      if (level > 0) {
        const subQuery = this.knex.queryBuilder()
        const knex = this.knex
        subQuery
          .select(`${alias}.id`, `${alias}.data`)
          .from("index_data AS " + alias)
          .join(`index_relation AS ${alias}_ref`, function () {
            this.on(
              `${alias}_ref.pivot`,
              "=",
              knex.raw("?", [`${parEntity}-${entity}`])
            )
              .andOn(`${alias}_ref.parent_id`, "=", `${parAlias}.id`)
              .andOn(`${alias}.id`, "=", `${alias}_ref.child_id`)
          })
          .where(`${alias}.name`, "=", knex.raw("?", [entity]))

        const joinWhere = this.selector.joinWhere ?? {}
        const joinKey = Object.keys(joinWhere).find((key) => {
          const k = key.split(".")
          k.pop()
          return k.join(".") === currentAliasPath
        })

        if (joinKey) {
          this.parseWhere(
            aliasMapping,
            { [joinKey]: joinWhere[joinKey] },
            subQuery
          )
        }

        queryParts.push(`LEFT JOIN LATERAL (
          ${subQuery.toQuery()}
        ) ${alias} ON TRUE`)
      }
    }

    const children = this.getStructureKeys(structure)
    for (const child of children) {
      const childStructure = structure[child] as Select
      queryParts = queryParts.concat(
        this.buildQueryParts(
          childStructure,
          mainAlias,
          mainEntity,
          child,
          aliasPath.concat(parentProperty),
          level + 1,
          aliasMapping
        )
      )
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
    const alias = aliasMapping[currentAliasPath]

    selectParts[currentAliasPath] = `${alias}.data`
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

  public buildQuery(countAllResults = true, returnIdOnly = false): string {
    const queryBuilder = this.knex.queryBuilder()

    const structure = this.structure
    const filter = this.selector.where ?? {}

    const { orderBy: order, skip, take } = this.options ?? {}

    const orderBy = this.transformOrderBy(
      (order && !Array.isArray(order) ? [order] : order) ?? []
    )

    const rootKey = this.getStructureKeys(structure)[0]
    const rootStructure = structure[rootKey] as Select
    const entity = this.getEntity(rootKey).ref.entity
    const rootEntity = entity.toLowerCase()
    const aliasMapping: { [path: string]: string } = {}

    const joinParts = this.buildQueryParts(
      rootStructure,
      "",
      entity,
      rootKey,
      [],
      0,
      aliasMapping
    )

    const rootAlias = aliasMapping[rootKey]
    const selectParts = !returnIdOnly
      ? this.buildSelectParts(rootStructure, rootKey, aliasMapping)
      : { [rootKey + ".id"]: `${rootAlias}.id` }

    if (countAllResults) {
      selectParts["offset_"] = this.knex.raw(
        `DENSE_RANK() OVER (ORDER BY ${rootEntity}0.id)`
      )
    }

    queryBuilder.select(selectParts)

    queryBuilder.from(`index_data AS ${rootEntity}0`)

    joinParts.forEach((joinPart) => {
      queryBuilder.joinRaw(joinPart)
    })

    queryBuilder.where(`${aliasMapping[rootEntity]}.name`, "=", entity)

    // WHERE clause
    this.parseWhere(aliasMapping, filter, queryBuilder)

    // ORDER BY clause
    for (const aliasPath in orderBy) {
      const path = aliasPath.split(".")
      const field = path.pop()
      const attr = path.join(".")
      const alias = aliasMapping[attr]
      const direction = orderBy[aliasPath]

      queryBuilder.orderByRaw(`${alias}.data->>'${field}' ${direction}`)
    }

    let sql = `WITH data AS (${queryBuilder.toQuery()})
    SELECT * ${
      countAllResults ? ", (SELECT max(offset_) FROM data) AS count" : ""
    }
    FROM data`

    let take_ = !isNaN(+take!) ? +take! : 15
    let skip_ = !isNaN(+skip!) ? +skip! : 0
    if (typeof take === "number" || typeof skip === "number") {
      sql += `
        WHERE offset_ > ${skip_}
          AND offset_ <= ${skip_ + take_}
      `
    }

    return sql
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
      [key: string]: { property: string; parents: string[]; parentPath: string }
    } = {}

    const initializeMaps = (structure: Select, path: string[]) => {
      const currentPath = path.join(".")
      maps[currentPath] = {}

      if (path.length > 1) {
        const property = path[path.length - 1]
        const parents = path.slice(0, -1)
        const parentPath = parents.join(".")

        isListMap[currentPath] = !!this.getEntity(currentPath).ref.parents.find(
          (p) => p.targetProp === property
        )?.isList

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

    resultSet.forEach((row) => {
      for (const path in maps) {
        const id = row[`${path}.id`]

        // root level
        if (!pathDetails[path]) {
          if (!maps[path][id]) {
            maps[path][id] = row[path] || undefined
          }
          continue
        }

        const { property, parents, parentPath } = pathDetails[path]
        const referenceKey = buildReferenceKey(parents, id, row)

        if (referenceMap[referenceKey]) {
          continue
        }

        maps[path][id] = row[path] || undefined

        const parentObj = maps[parentPath][row[`${parentPath}.id`]]

        if (!parentObj) {
          continue
        }

        const isList = isListMap[parentPath + "." + property]
        if (isList) {
          parentObj[property] ??= []
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
