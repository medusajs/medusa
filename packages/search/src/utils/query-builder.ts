import { isObject, isString } from "@medusajs/utils"
import { Knex } from "knex"
import {
  OrderBy,
  QueryFormat,
  QueryOptions,
  SchemaObjectRepresentation,
  SchemaPropertiesMap,
  Select,
} from "../types"

export class QueryBuilder {
  private readonly structure: Select
  private readonly knex: Knex
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
    this.knex = args.knex
    this.structure = this.selector.select
  }

  private getStructureKeys(structure) {
    return Object.keys(structure ?? {}).filter((key) => key !== "entity")
  }

  private getEntity(path): SchemaPropertiesMap[0] {
    if (!this.schema._schemaPropertiesMap[path]) {
      throw new Error(`Could not find entity for path: ${path}`)
    }

    return this.schema._schemaPropertiesMap[path]
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

            if (typeof subValue === "number") {
              builder.whereRaw(
                `COALESCE(NULLIF(${aliasMapping[attr]}.data->>?, ''), '0')::numeric ${operator} ?`,
                [field, subValue]
              )
            } else {
              builder.whereRaw(`${aliasMapping[attr]}.data->>? ${operator} ?`, [
                field,
                subValue,
              ])
            }
          } else {
            throw new Error(`Unsupported operator: ${subKey}`)
          }
        })
      } else {
        const path = key.split(".")
        const field = path.pop()
        const attr = path.join(".")

        if (Array.isArray(value)) {
          if (typeof value[0] === "number") {
            builder.whereRaw(
              `COALESCE(NULLIF(${aliasMapping[attr]}.data->>?, ''), '0')::numeric IN (?)`,
              [field, value]
            )
          } else {
            builder.whereRaw(`${aliasMapping[attr]}.data->>? IN (?)`, [
              field,
              value,
            ])
          }
        } else {
          if (typeof value === "number") {
            builder.whereRaw(
              `COALESCE(NULLIF(${aliasMapping[attr]}.data->>?, ''), '0')::numeric = ?`,
              [field, value]
            )
          } else {
            builder.whereRaw(`${aliasMapping[attr]}.data->>? = ?`, [
              field,
              value,
            ])
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
          .select(`${alias}.*`)
          .from("catalog AS " + alias)
          .join(`catalog_relation AS ${alias}_ref`, function () {
            this.on(`${alias}.id`, "=", `${alias}_ref.child_id`)
              .andOn(`${alias}_ref.child_name`, "=", knex.raw("?", [entity]))
              .andOn(
                `${alias}_ref.parent_name`,
                "=",
                knex.raw("?", [parEntity])
              )
              .andOn(`${alias}_ref.parent_id`, "=", `${parAlias}.id`)
          })

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

  public buildQuery(): string {
    return this.buildQuery_()
  }

  public buildDistinctQuery(countWhenPaginating = true): string {
    return this.buildQuery_(true, countWhenPaginating)
  }

  protected buildQuery_(
    distinctRootOnly = false,
    countAllResults = distinctRootOnly
  ): string {
    const queryBuilder = this.knex.queryBuilder()

    const structure = this.structure
    const filter = this.selector.where ?? {}

    const {
      orderBy: order,
      skip,
      take,
      keepFilteredEntities,
    } = this.options ?? {}

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

    if (distinctRootOnly) {
      queryBuilder.select(`${rootEntity}0.id`)

      if (countAllResults) {
        queryBuilder.select(
          this.knex.raw(`COUNT(${rootEntity}0.id) OVER() as count`)
        )
      }

      queryBuilder.groupBy(`${rootEntity}0.id`)
    } else {
      const selectParts = this.buildSelectParts(
        rootStructure,
        rootKey,
        aliasMapping
      )
      queryBuilder.select(selectParts)
    }

    queryBuilder.from(`catalog AS ${rootEntity}0`)

    joinParts.forEach((joinPart) => {
      queryBuilder.joinRaw(joinPart)
    })

    let hasRootIds = false
    if (filter.ids) {
      queryBuilder
        .where(`${aliasMapping[rootEntity]}.id`, "IN", filter.ids)
        .andWhere(`${aliasMapping[rootEntity]}.name`, "=", entity)

      hasRootIds = true
      delete filter.ids
    } else {
      queryBuilder.where(`${aliasMapping[rootEntity]}.name`, "=", entity)
    }

    // WHERE clause
    if (!hasRootIds || (hasRootIds && !keepFilteredEntities)) {
      this.parseWhere(aliasMapping, filter, queryBuilder)
    }

    // ORDER BY clause
    for (const aliasPath in orderBy) {
      const path = aliasPath.split(".")
      const field = path.pop()
      const attr = path.join(".")
      const alias = aliasMapping[attr]
      const direction = orderBy[aliasPath]

      queryBuilder.orderByRaw(`${alias}.data->>'${field}' ${direction}`)
    }

    if (typeof take === "number" && distinctRootOnly) {
      queryBuilder.limit(take)
    }
    if (typeof skip === "number" && distinctRootOnly) {
      queryBuilder.offset(skip)
    }

    return queryBuilder.toQuery()
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
