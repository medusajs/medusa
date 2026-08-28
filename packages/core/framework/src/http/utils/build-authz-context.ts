import { AuthzContextConfig, MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, deduplicate } from "@medusajs/utils"

type AuthzContextInput = {
  actor_type: string
  actor_id: string
  config: AuthzContextConfig
  container: MedusaContainer
}

type AuthzContext = {
  grantees: {
    type: string
    id: string
  }[]
}

/**
 * Walks `path` from `root`, flattening to-many relations (arrays) at any
 * level, and returns every id reached. Null/missing intermediates are
 * skipped; non-string leaves are dropped.
 */
const collect = (root: unknown, path: string): string[] => {
  const walk = (node: unknown, segments: string[]): unknown[] => {
    if (node == null) {
      return []
    }
    if (Array.isArray(node)) {
      return node.flatMap((item) => walk(item, segments))
    }
    if (!segments.length) {
      return [node]
    }
    const [head, ...rest] = segments
    return walk((node as Record<string, unknown>)[head], rest)
  }

  return walk(root, path.split(".")).filter(
    (value): value is string => typeof value === "string"
  )
}

export async function buildAuthzContext({
  actor_type,
  actor_id,
  config,
  container,
}: AuthzContextInput): Promise<AuthzContext> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const fields = deduplicate(config.grantees.map((grantee) => grantee.path))

  const {
    data: [root],
  } = await query.graph({
    entity: actor_type,
    fields,
    filters: { id: actor_id },
  })

  if (!root) {
    return { grantees: [] }
  }

  return {
    grantees: config.grantees.flatMap((grantee) =>
      collect(root, grantee.path).map((id) => ({
        type: grantee.entity,
        id,
      }))
    ),
  }
}
