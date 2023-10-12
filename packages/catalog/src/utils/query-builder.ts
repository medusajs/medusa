import { isObject, isString } from "@medusajs/utils"
import { Knex } from "knex"
import {
  OrderBy,
  QueryFormat,
  QueryOptions,
  SchemaObjectRepresentation,
  Select,
} from "../types"

export class QueryBuilder {
  private readonly structure: Select
  private readonly builder: Knex.QueryBuilder
  private readonly selector: QueryFormat
  private readonly options?: QueryOptions
  private readonly schema: SchemaObjectRepresentation

  constructor(args: {
    schema: SchemaObjectRepresentation
    knex: Knex
    selector: QueryFormat
    options?: QueryOptions
  }) {
    this.schema = args.schema
    this.selector = args.selector
    this.options = args.options
    this.builder = args.knex.queryBuilder()

    this.structure = this.selector.select
  }

  private getStructureKeys(structure) {
    return Object.keys(structure ?? {}).filter((key) => key !== "entity")
  }

  private getEntity(path): string {
    if (!this.schema._schemaPropertiesMap[path]?.entity) {
      throw new Error(`Could not find entity for path: ${path}`)
    }

    return this.schema._schemaPropertiesMap[path].entity
  }

  private parseWhere(
    aliasMapping: { [path: string]: string },
    obj: object,
    builder: Knex.QueryBuilder
  ) {
    const OPERATOR_MAP = {
      $eq: "=",
      $lt: "<",
      $gt: ">",
      $lte: "<=",
      $gte: ">=",
      $ne: "!=",
      $in: "IN",
      $like: "LIKE",
      $ilike: "ILIKE",
    }
    const keys = Object.keys(obj)

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
          const subValue = value[subKey]
          let operator = OPERATOR_MAP[subKey]
          if (operator) {
            const path = key.split(".")
            const field = path.pop()
            const attr = path.join(".")
            builder.where(
              aliasMapping[attr] + `.data->>${field}`,
              operator,
              subValue
            )
          } else {
            throw new Error(`Unsupported operator: ${subKey}`)
          }
        })
      } else {
        const path = key.split(".")
        const field = path.pop()
        const attr = path.join(".")
        builder.where(
          aliasMapping[attr] + `.data->>${field}`,
          Array.isArray(value) ? "IN" : "=",
          value
        )
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

    const entity = this.getEntity(currentAliasPath)
    const alias = entity.toLowerCase() + level

    aliasMapping[currentAliasPath] = alias

    let queryParts: string[] = []
    const children = this.getStructureKeys(structure)

    if (level > 0) {
      queryParts.push(`LEFT JOIN LATERAL (
      SELECT ${alias}.* 
      FROM catalog AS ${alias}
      JOIN catalog_relation AS ${alias}_ref
        ON ${alias}.id = ${alias}_ref.child_id
        AND ${alias}_ref.child_name = '${entity}'
        AND ${alias}_ref.parent_name = '${parentEntity}'
        AND ${alias}_ref.parent_id = ${parentAlias}.id
    ) ${alias} ON TRUE`)
    }

    for (const child of children) {
      const childStructure = structure[child] as Select
      queryParts = queryParts.concat(
        this.buildQueryParts(
          childStructure,
          alias,
          entity,
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
    aliasPath: string[] = [],
    selectParts: object = {},
    level = 0
  ): object {
    const currentAliasPath = [...aliasPath, parentProperty].join(".")
    const entity = this.getEntity(currentAliasPath)
    const alias = entity.toLowerCase() + level

    selectParts[currentAliasPath] = `${alias}.data`
    selectParts[currentAliasPath + ".id"] = `${alias}.id`

    const children = this.getStructureKeys(structure)

    for (const child of children) {
      const childStructure = structure[child] as Select

      this.buildSelectParts(
        childStructure,
        child,
        aliasPath.concat(parentProperty),
        selectParts,
        level + 1
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

  public buildQuery(): string {
    const structure = this.structure
    const filter = this.selector.where ?? {}
    const order = this.options?.orderBy ?? {}

    const orderBy = this.transformOrderBy(
      (order && !Array.isArray(order) ? [order] : order) ?? []
    )

    const { skip, take } = this.options ?? { skip: 0, take: 15 }

    const rootKey = this.getStructureKeys(structure)[0]
    const rootStructure = structure[rootKey] as Select
    const entity = this.getEntity(rootKey)
    const rootEntity = entity.toLowerCase()
    const aliasMapping: { [path: string]: string } = {}

    const selectParts = this.buildSelectParts(rootStructure, rootKey)

    const joinParts = this.buildQueryParts(
      rootStructure,
      "",
      entity,
      rootKey,
      [],
      0,
      aliasMapping
    )

    this.builder.select(selectParts).from(`catalog AS ${rootEntity}0`)

    joinParts.forEach((joinPart) => {
      this.builder.joinRaw(joinPart)
    })

    this.builder.where(`${aliasMapping[rootEntity]}.name`, "=", entity)

    // WHERE clause
    this.parseWhere(aliasMapping, filter, this.builder)

    // ORDER BY clause
    for (const aliasPath in orderBy) {
      const path = aliasPath.split(".")
      const field = path.pop()
      const attr = path.join(".")
      const alias = aliasMapping[attr]
      const direction = orderBy[aliasPath]

      this.builder.orderByRaw(`${alias}.data->>'${field}' ${direction}`)
    }

    if (typeof take === "number") {
      this.builder.limit(take)
    }
    if (typeof skip === "number") {
      this.builder.offset(skip)
    }

    return this.builder.toQuery()
  }

  public buildObjectFromResultset(
    resultSet: Record<string, any>[]
  ): Record<string, any>[] {
    const structure = this.structure
    const rootKey = this.getStructureKeys(structure)[0]

    const maps: { [key: string]: { [id: string]: Record<string, any> } } = {}
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

        // TODO: check if relation is 1-1 or 1-n to decide if it should be an array
        parentObj[property] ??= []

        if (maps[path][id] !== undefined) {
          parentObj[property].push(maps[path][id])
        }

        referenceMap[referenceKey] = true
      }
    })

    return Object.values(maps[rootKey] ?? {})
  }
}
