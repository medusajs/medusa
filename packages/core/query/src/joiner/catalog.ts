import {
  JoinerRelationship,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
} from "@medusajs/types"
import { isDefined, isString } from "@medusajs/utils"
import {
  ComputedJoinerRelationship,
  InternalJoinerServiceConfig,
  RelationMap,
} from "./types"

type MutableJoinerServiceConfig = Omit<ModuleJoinerConfig, "relationships"> & {
  relationships?: Map<string, JoinerRelationship | JoinerRelationship[]>
}

type ExtendedRelBucket = {
  fieldAlias: Record<string, any>
  relationships: Map<string, JoinerRelationship | JoinerRelationship[]>
}

/**
 * Indexed view of module joiner configs: services, aliases, entities,
 * relationships, and fieldAlias shortcuts.
 *
 * Built once per RemoteJoiner instance.
 */
export class GraphCatalog {
  private cache: Map<string, InternalJoinerServiceConfig> = new Map()
  private relationMap: RelationMap = new Map()

  constructor(
    serviceConfigs: ModuleJoinerConfig[],
    options: {
      autoCreateServiceNameAlias?: boolean
      relationMap?: RelationMap
    } = {}
  ) {
    if (options.relationMap) {
      this.relationMap = options.relationMap
    }

    const cloned = JSON.parse(JSON.stringify(serviceConfigs), (key, value) =>
      key === "schema" ? undefined : value
    ) as ModuleJoinerConfig[]

    this.index(cloned, {
      autoCreateServiceNameAlias: options.autoCreateServiceNameAlias ?? true,
    })
  }

  getServiceConfig({
    serviceName,
    serviceAlias,
    entity,
  }: {
    serviceName?: string
    serviceAlias?: string
    entity?: string
  }): InternalJoinerServiceConfig | undefined {
    if (entity) {
      const byEntity = this.cache.get(`entity_${entity}`)
      if (byEntity) {
        return byEntity
      }
    }

    if (serviceAlias) {
      return this.cache.get(`alias_${serviceAlias}`)
    }

    return this.cache.get(serviceName!)
  }

  getEntity(entity: string, prop: string): string | undefined {
    return this.relationMap.get(entity)?.get(prop)
  }

  /**
   * Internal cross-module join metadata (crossjoinable fields, physical table
   * name) attached to the alias entry matching the given entity.
   */
  getAliasMetadata(
    entity: string | undefined
  ): NonNullable<JoinerServiceConfigAlias["__internal"]> | undefined {
    if (!entity) {
      return undefined
    }

    const serviceConfig = this.getServiceConfig({ entity })
    const aliases = serviceConfig?.alias

    if (!Array.isArray(aliases)) {
      return undefined
    }

    return aliases.find((alias) => alias.entity === entity && alias.__internal)
      ?.__internal
  }

  getEntityRelationship(params: {
    parentServiceConfig: InternalJoinerServiceConfig
    property: string
    entity?: string
  }): ComputedJoinerRelationship | undefined {
    const { parentServiceConfig, property, entity } = params

    const propEntity = entity ?? parentServiceConfig?.entity
    const rel = parentServiceConfig?.relationships?.get(property)

    if (Array.isArray(rel)) {
      if (!propEntity) {
        return rel[0] as ComputedJoinerRelationship
      }

      const entityRel = rel.find((r) => r.entity === propEntity)
      if (entityRel) {
        return entityRel as ComputedJoinerRelationship
      }

      const serviceEntity = this.getServiceConfig({ entity: propEntity })!

      return rel.find((r) =>
        serviceEntity.primaryKeys.includes(r.primaryKey)
      )! as ComputedJoinerRelationship
    }

    return rel as ComputedJoinerRelationship | undefined
  }

  private index(
    serviceConfigs: ModuleJoinerConfig[],
    { autoCreateServiceNameAlias }: { autoCreateServiceNameAlias: boolean }
  ) {
    const expandedRelationships: Map<string, ExtendedRelBucket> = new Map()

    for (const service of serviceConfigs) {
      const service_ = service as MutableJoinerServiceConfig

      if (this.cache.has(service_.serviceName!)) {
        throw new Error(`Service "${service_.serviceName}" is already defined.`)
      }

      const isReadOnlyDefinition =
        !isDefined(service_.serviceName) || service_.isReadOnlyLink

      this.indexRelationships(service_)

      if (!isReadOnlyDefinition) {
        this.indexAliases(serviceConfigs, service_, autoCreateServiceNameAlias)
      }

      this.collectExtends(service_, expandedRelationships)
    }

    this.mergeExtends(expandedRelationships)
  }

  private indexRelationships(service_: MutableJoinerServiceConfig) {
    service_.relationships ??= new Map()

    if (Array.isArray(service_.relationships)) {
      const relationships = new Map<string, JoinerRelationship>()
      for (const relationship of service_.relationships) {
        relationships.set(relationship.alias, relationship)
      }
      service_.relationships = relationships
    }

    this.precomputeKeys(service_.relationships)
  }

  private indexAliases(
    serviceConfigs: ModuleJoinerConfig[],
    service_: MutableJoinerServiceConfig,
    autoCreateServiceNameAlias: boolean
  ) {
    service_.alias ??= []

    if (!Array.isArray(service_.alias)) {
      service_.alias = [service_.alias]
    }

    if (autoCreateServiceNameAlias) {
      service_.alias.push({ name: service_.serviceName! })
    }

    for (let idx = 0; idx < service_.alias.length; idx++) {
      const alias = service_.alias[idx]
      if (!Array.isArray(alias.name)) {
        continue
      }

      for (const name of alias.name) {
        service_.alias.push({
          name,
          entity: alias.entity,
          args: alias.args,
          __internal: alias.__internal,
        })
      }
      service_.alias.splice(idx, 1)
      idx--
    }

    for (const alias of service_.alias) {
      if (this.cache.has(`alias_${alias.name}`)) {
        const defined = this.cache.get(`alias_${alias.name}`)

        if (service_.serviceName === defined?.serviceName) {
          continue
        }

        throw new Error(
          `Cannot add alias "${alias.name}" for "${service_.serviceName}". It is already defined for Service "${defined?.serviceName}".`
        )
      }

      const args =
        service_.args || alias.args
          ? { ...service_.args, ...alias.args }
          : undefined

      const aliasName = alias.name as string
      const rel = {
        alias: aliasName,
        entity: alias.entity,
        foreignKey: alias.name + "_id",
        primaryKey: "id",
        serviceName: service_.serviceName!,
        args,
      }

      this.addRelationship(service_.relationships!, aliasName, rel)
      this.cacheByAlias(serviceConfigs, alias)
    }

    this.cacheByServiceName(serviceConfigs, service_.serviceName!)
  }

  private collectExtends(
    service_: MutableJoinerServiceConfig,
    expandedRelationships: Map<string, ExtendedRelBucket>
  ) {
    service_.extends ??= []

    for (const extend of service_.extends) {
      if (!expandedRelationships.has(extend.serviceName)) {
        expandedRelationships.set(extend.serviceName, {
          fieldAlias: {},
          relationships: new Map(),
        })
      }

      const bucket = expandedRelationships.get(extend.serviceName)!
      const rel = extend.relationship as ComputedJoinerRelationship
      this.ensureKeyArrays(rel)
      this.addRelationship(bucket.relationships, rel.alias, rel)
      this.mergeFieldAlias(bucket, extend)
    }
  }

  private mergeExtends(expandedRelationships: Map<string, ExtendedRelBucket>) {
    for (const [
      serviceName,
      { fieldAlias, relationships },
    ] of expandedRelationships) {
      if (!this.cache.has(serviceName)) {
        throw new Error(`Service "${serviceName}" was not found`)
      }

      const service_ = this.cache.get(serviceName)!
      relationships.forEach((relationship, alias) => {
        this.addRelationship(
          service_.relationships!,
          alias,
          relationship as ComputedJoinerRelationship
        )
      })

      service_.fieldAlias ??= {}
      Object.assign(service_.fieldAlias, fieldAlias)

      if (Object.keys(service_.fieldAlias).length) {
        const conflictAliases = Array.from(
          service_.relationships!.keys()
        ).filter((alias) => fieldAlias[alias as string])

        if (conflictAliases.length) {
          throw new Error(
            `Conflict configuration for service "${serviceName}". The following aliases are already defined as relationships: ${conflictAliases.join(
              ", "
            )}`
          )
        }
      }
    }
  }

  private precomputeKeys(
    relationships?: Map<string, JoinerRelationship | JoinerRelationship[]>
  ) {
    if (!relationships?.size) {
      return
    }

    for (const [, relVal] of relationships.entries()) {
      if (Array.isArray(relVal)) {
        for (const rel of relVal) {
          this.ensureKeyArrays(rel as ComputedJoinerRelationship)
        }
      } else if (relVal) {
        this.ensureKeyArrays(relVal as ComputedJoinerRelationship)
      }
    }
  }

  private ensureKeyArrays(rel: ComputedJoinerRelationship) {
    rel.primaryKeyArr = rel.primaryKey.split(",")
    rel.foreignKeyArr = rel.foreignKey
      .split(",")
      .map((fk) => fk.split(".").pop()!)
  }

  private addRelationship(
    map: Map<string, JoinerRelationship | JoinerRelationship[]>,
    alias: string,
    rel: JoinerRelationship | ComputedJoinerRelationship
  ) {
    if (map.has(alias)) {
      const existing = map.get(alias)!
      map.set(
        alias,
        Array.isArray(existing) ? existing.concat(rel) : [existing, rel]
      )
    } else {
      map.set(alias, rel)
    }
  }

  private mergeFieldAlias(
    bucket: ExtendedRelBucket,
    extend: {
      entity?: string
      serviceName: string
      fieldAlias?: Record<string, any>
    }
  ) {
    for (const [alias, fieldAlias] of Object.entries(extend.fieldAlias ?? {})) {
      const objAlias = isString(fieldAlias)
        ? { path: fieldAlias }
        : (fieldAlias as object)

      if (bucket.fieldAlias[alias]) {
        if (!Array.isArray(bucket.fieldAlias[alias])) {
          bucket.fieldAlias[alias] = [bucket.fieldAlias[alias]]
        }

        if (bucket.fieldAlias[alias].some((f) => f.entity === extend.entity)) {
          throw new Error(
            `Cannot add alias "${alias}" for "${extend.serviceName}". It is already defined for Entity "${extend.entity}".`
          )
        }

        bucket.fieldAlias[alias].push({
          ...objAlias,
          entity: extend.entity,
        })
      } else {
        bucket.fieldAlias[alias] = {
          ...objAlias,
          entity: extend.entity,
        }
      }
    }
  }

  private cacheByAlias(
    serviceConfigs: ModuleJoinerConfig[],
    serviceAlias: JoinerServiceConfigAlias
  ) {
    const name = `alias_${serviceAlias.name}`
    if (this.cache.has(name)) {
      return
    }

    let aliasConfig: JoinerServiceConfigAlias | undefined
    const config = serviceConfigs.find((conf) => {
      const aliases = conf.alias as JoinerServiceConfigAlias[]
      const hasArgs = aliases?.find((alias) => alias.name === serviceAlias.name)
      aliasConfig = hasArgs
      return hasArgs
    })

    if (!config) {
      return
    }

    config.fieldAlias ??= {}

    const serviceConfig = { ...config, entity: serviceAlias.entity }
    if (aliasConfig) {
      serviceConfig.args = { ...config?.args, ...aliasConfig?.args }
    }
    this.cache.set(name, serviceConfig as InternalJoinerServiceConfig)

    if (serviceAlias.entity) {
      this.cache.set(
        `entity_${serviceAlias.entity}`,
        serviceConfig as InternalJoinerServiceConfig
      )
    }
  }

  private cacheByServiceName(
    serviceConfigs: ModuleJoinerConfig[],
    serviceName: string
  ) {
    const config = serviceConfigs.find(
      (c) => c.serviceName === serviceName
    ) as InternalJoinerServiceConfig
    config.fieldAlias ??= {}
    this.cache.set(serviceName, config)
  }
}
