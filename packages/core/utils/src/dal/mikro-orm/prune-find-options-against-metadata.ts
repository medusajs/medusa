import type { EntityMetadata } from "@medusajs/deps/mikro-orm/core"

export interface PruneFindOptionsResult {
  droppedFields: string[]
  droppedPopulate: string[]
}

interface PruneFindOptionsLogger {
  debug?: (message: string) => void
}

interface FindOptionsLike {
  fields?: unknown
  populate?: unknown
}

const stripStrategy = (segment: string): string => segment.split(":")[0]

const isFieldPathResolvable = (
  rootMeta: EntityMetadata<any>,
  path: string
): boolean => {
  if (path === "*") {
    return true
  }
  const segments = path.split(".")
  let currentMeta: EntityMetadata<any> | undefined = rootMeta
  for (let i = 0; i < segments.length; i++) {
    const segment = stripStrategy(segments[i])
    const isLast = i === segments.length - 1
    if (segment === "*") {
      return isLast && !!currentMeta
    }
    if (!currentMeta) {
      return false
    }
    const prop = currentMeta.properties?.[segment]
    if (!prop) {
      return false
    }
    if (!isLast) {
      if (!prop.targetMeta) {
        return false
      }
      currentMeta = prop.targetMeta
    }
  }
  return true
}

/**
 * Drop entries from `options.fields` and `options.populate` whose dotted
 * paths can't be resolved against the local entity's MikroORM metadata.
 *
 * Why: MikroORM 6.6.14 derives populate hints from nested `fields`
 * entries and merges them into `options.populate`. If any derived hint
 * references a non-relation or a missing property, MikroORM rejects it
 * at populate-resolution time. Pruning at the DAL boundary keeps that
 * branch harmless and matches the silent no-op behavior of 6.6.12 while
 * still surfacing dropped paths to debug logs.
 */
export function pruneFindOptionsAgainstMetadata(
  meta: EntityMetadata<any> | undefined | null,
  options: FindOptionsLike,
  logger?: PruneFindOptionsLogger
): PruneFindOptionsResult {
  const droppedFields: string[] = []
  const droppedPopulate: string[] = []

  if (!meta || !options) {
    return { droppedFields, droppedPopulate }
  }

  if (Array.isArray(options.fields)) {
    options.fields = (options.fields as unknown[]).filter((f) => {
      if (typeof f !== "string") {
        return true
      }
      if (isFieldPathResolvable(meta, f)) {
        return true
      }
      droppedFields.push(f)
      return false
    })
  }

  if (Array.isArray(options.populate)) {
    options.populate = (options.populate as unknown[]).filter((p) => {
      if (typeof p !== "string") {
        return true
      }
      // Populate uses the same resolvability rule as fields: non-final
      // segments must be real relations, the final segment can be a
      // scalar. Medusa's buildQuery routinely sends paths like
      // "payments.captures.amount" through populate from the `relations`
      // config, where the trailing segment is a scalar projection.
      if (isFieldPathResolvable(meta, p)) {
        return true
      }
      droppedPopulate.push(p)
      return false
    })
  }

  if (logger?.debug) {
    if (droppedFields.length) {
      logger.debug(
        `Pruned non-resolvable fields against entity ${
          meta.className
        }: ${droppedFields.join(", ")}`
      )
    }
    if (droppedPopulate.length) {
      logger.debug(
        `Pruned non-resolvable populate hints against entity ${
          meta.className
        }: ${droppedPopulate.join(", ")}`
      )
    }
  }

  return { droppedFields, droppedPopulate }
}
