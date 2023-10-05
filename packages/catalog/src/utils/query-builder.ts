type EntityStructure = {
  entity?: string
  _filter?: { [alias: string]: { [key: string]: string } }
  _order?: { [alias: string]: { [key: string]: string } }
  [key: string]:
    | Omit<EntityStructure, "_filter" | "_order">
    | string
    | { [key: string]: string }
    | undefined
}

export class QueryBuilder {
  constructor() {}

  private getStructureKeys(structure) {
    return Object.keys(structure).filter((key) => key !== "entity")
  }

  private buildQueryParts(
    structure: EntityStructure,
    parentAlias: string,
    parentEntity: string,
    parentProperty: string,
    aliasPath: string[] = [],
    level = 0,
    aliasMapping: { [path: string]: string } = {}
  ): string[] {
    const entity = structure.entity!
    const alias = entity.toLowerCase() + level
    const currentAliasPath = [...aliasPath, parentProperty].join(".")

    aliasMapping[currentAliasPath] = alias

    let queryParts: string[] = []
    const children = this.getStructureKeys(structure)

    if (level > 0) {
      queryParts.push(`LEFT JOIN LATERAL (
      SELECT ${alias}.* 
      FROM catalog AS ${alias}
      JOIN catalog_reference AS ${alias}_ref
        ON ${alias}.id = ${alias}_ref.child_id
        AND ${alias}_ref.child = '${entity}'
        AND ${alias}_ref.parent = '${parentEntity}'
        AND ${alias}_ref.parent_id = ${parentAlias}.id
    ) ${alias} ON TRUE`)
    }

    for (const child of children) {
      const childStructure = structure[child] as EntityStructure
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

  private buildFilterAndOrderClauses(
    filter: { [alias: string]: { [key: string]: string } },
    order: { [alias: string]: { [key: string]: string } },
    aliasMapping: { [path: string]: string }
  ): { whereClause: string; orderClause: string } {
    const whereConditions: string[] = []
    const orderConditions: string[] = []

    // WHERE clause
    for (const aliasPath in filter) {
      const alias = aliasMapping[aliasPath]
      for (const field in filter[aliasPath]) {
        const condition = filter[aliasPath][field]
        whereConditions.push(`(${alias}.data->>'${field}') ${condition}`)
      }
    }

    // ORDER BY clause
    for (const aliasPath in order) {
      const alias = aliasMapping[aliasPath]
      for (const field in order[aliasPath]) {
        const direction = order[aliasPath][field]
        orderConditions.push(`${alias}.data->>'${field}' ${direction}`)
      }
    }

    return {
      whereClause: whereConditions.length
        ? whereConditions.join(" OR ") // TODO, use mikro-orm to build WHERE clause
        : "",
      orderClause: orderConditions.length ? orderConditions.join(", ") : "",
    }
  }

  private buildSelectParts(
    structure: EntityStructure,
    parentProperty: string,
    aliasPath: string[] = [],
    level = 0
  ): string[] {
    const entity = structure.entity!
    const alias = entity.toLowerCase() + level
    const currentAliasPath = [...aliasPath, parentProperty].join(".")

    let selectParts: string[] = [
      `${alias}.data AS "${currentAliasPath}",
    ${alias}.id AS "${currentAliasPath}.id"`,
    ]
    const children = this.getStructureKeys(structure)

    for (const child of children) {
      const childStructure = structure[child] as EntityStructure
      selectParts = selectParts.concat(
        this.buildSelectParts(
          childStructure,
          child,
          aliasPath.concat(parentProperty),
          level + 1
        )
      )
    }

    return selectParts
  }

  public buildQuery(structure: EntityStructure): string {
    const filter = structure._filter || {}
    const order = structure._order || {}

    delete structure._filter
    delete structure._order

    const rootKey = this.getStructureKeys(structure)[0]

    const rootStructure = structure[rootKey] as EntityStructure
    const rootEntity = rootStructure.entity!.toLowerCase()
    const aliasMapping: { [path: string]: string } = {}
    const joinParts = this.buildQueryParts(
      rootStructure,
      "",
      rootStructure.entity!,
      rootKey,
      [],
      0,
      aliasMapping
    )
    const selectParts = this.buildSelectParts(rootStructure, rootKey)

    const { whereClause, orderClause } = this.buildFilterAndOrderClauses(
      filter,
      order,
      aliasMapping
    )

    return `SELECT 
    ${selectParts.join(",\n    ")}
FROM catalog AS ${rootEntity}0
${joinParts.join("\n")}
WHERE ${aliasMapping[rootEntity]}.type = '${rootStructure.entity}' ${
      whereClause ? `AND (${whereClause})` : ""
    }
${orderClause ? `ORDER BY\n    ${orderClause}` : ""}`
  }

  public buildObjectFromResultset(
    resultSet: Record<string, any>[],
    inputStructure: EntityStructure
  ): Record<string, any>[] {
    const rootKey = Object.keys(inputStructure)[0]

    const maps: { [key: string]: { [id: string]: Record<string, any> } } = {}
    const referenceMap: { [key: string]: any } = {}
    const pathDetails: {
      [key: string]: { property: string; parents: string[]; parentPath: string }
    } = {}

    function createMaps(structure: EntityStructure, path: string[]) {
      const currentPath = path.join(".")
      maps[currentPath] = {}

      if (path.length > 1) {
        const property = path[path.length - 1]
        const parents = path.slice(0, -1)
        const parentPath = parents.join(".")
        pathDetails[currentPath] = { property, parents, parentPath }
      }

      delete structure.entity
      delete structure._filter
      delete structure._order
      for (const key in structure) {
        createMaps(structure[key] as EntityStructure, [...path, key])
      }
    }
    createMaps(inputStructure[rootKey] as EntityStructure, [rootKey])

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
            maps[path][id] = row[path] ? JSON.parse(row[path]) : {}
          }
          continue
        }

        const { property, parents, parentPath } = pathDetails[path]
        const referenceKey = buildReferenceKey(parents, id, row)

        if (referenceMap[referenceKey]) {
          continue
        }

        maps[path][id] = row[path] ? JSON.parse(row[path]) : {}

        const parentObj = maps[parentPath][row[`${parentPath}.id`]]

        // TODO: check if relation is 1-1 or 1-n to decide if it should be an array
        parentObj[property] ??= []

        parentObj[property].push(maps[path][id])
        referenceMap[referenceKey] = true
      }
    })

    return Object.values(maps[rootKey] ?? {})
  }
}
