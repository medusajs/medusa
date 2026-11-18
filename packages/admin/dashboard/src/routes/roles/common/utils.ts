import { HttpTypes } from "@medusajs/types"

import {
  CUSTOM_GROUP_ID,
  MATRIX_OPERATIONS,
  PERMISSION_GROUPS,
} from "./constants"

export type MatrixPolicy = Pick<
  HttpTypes.AdminRbacPolicy,
  "id" | "key" | "resource" | "operation"
>

export type MatrixCell = { policy: MatrixPolicy; grantable: boolean }

export type MatrixResource = {
  resource: string
  /** Keyed by operation. Wildcard policies are never part of the matrix. */
  cells: Record<string, MatrixCell>
}

export type MatrixGroup = {
  id: string
  /** The four standard operations, then any others in the group, sorted by name. */
  operations: string[]
  resources: MatrixResource[]
}

export type GroupLevel = "none" | "view" | "full" | "mixed"

export type SelectionTemplate = "full" | "readonly"

const READ = "read"

const isWildcard = (policy: MatrixPolicy) =>
  policy.resource === "*" || policy.operation === "*"

const cellsOf = (resource: MatrixResource) => Object.values(resource.cells)

const groupCellsOf = (group: MatrixGroup) => group.resources.flatMap(cellsOf)

const matrixCellsOf = (matrix: MatrixGroup[]) => matrix.flatMap(groupCellsOf)

const hasOtherSelected = (
  resource: MatrixResource,
  selection: Set<string>,
  exceptOperation: string
) =>
  Object.entries(resource.cells).some(
    ([operation, cell]) =>
      operation !== exceptOperation && selection.has(cell.policy.id)
  )

const findCell = (matrix: MatrixGroup[], policyId: string) => {
  for (const group of matrix) {
    for (const resource of group.resources) {
      for (const cell of cellsOf(resource)) {
        if (cell.policy.id === policyId) {
          return { resource, cell }
        }
      }
    }
  }

  return null
}

/**
 * Formats a resource or operation name for display when it has no translation,
 * e.g. `order_item` becomes `Order item`.
 */
export const formatFallbackLabel = (name: string) => {
  const label = name.replace(/_/g, " ").trim()

  return label.charAt(0).toUpperCase() + label.slice(1)
}

/**
 * Returns the policies that are left out of the matrix: those whose resource
 * or operation is a wildcard.
 */
export const getWildcardPolicies = <T extends MatrixPolicy>(policies: T[]) =>
  policies.filter(isWildcard)

/**
 * Groups policies into a resource by operation matrix. Groups follow the order
 * of `PERMISSION_GROUPS`; resources the map does not know about go to a
 * trailing Custom group, sorted by name.
 */
export const buildMatrix = (
  policies: MatrixPolicy[],
  assignableIds: Set<string>
): MatrixGroup[] => {
  const byResource = new Map<string, MatrixResource>()

  for (const policy of policies) {
    if (isWildcard(policy)) {
      continue
    }

    let resource = byResource.get(policy.resource)
    if (!resource) {
      resource = { resource: policy.resource, cells: {} }
      byResource.set(policy.resource, resource)
    }

    // The first policy for a resource and operation wins.
    if (!resource.cells[policy.operation]) {
      resource.cells[policy.operation] = {
        policy,
        grantable: assignableIds.has(policy.id),
      }
    }
  }

  const mapped = new Set(PERMISSION_GROUPS.flatMap((g) => g.resources))

  const entries = [
    ...PERMISSION_GROUPS.map(({ id, resources }) => ({
      id,
      resources: resources
        .map((name) => byResource.get(name))
        .filter((resource): resource is MatrixResource => !!resource),
    })),
    {
      id: CUSTOM_GROUP_ID,
      resources: [...byResource.values()]
        .filter((resource) => !mapped.has(resource.resource))
        .sort((a, b) => a.resource.localeCompare(b.resource)),
    },
  ]

  return entries
    .filter((entry) => entry.resources.length > 0)
    .map((entry) => {
      const standard: string[] = [...MATRIX_OPERATIONS]
      const extra = new Set<string>()

      for (const resource of entry.resources) {
        for (const operation of Object.keys(resource.cells)) {
          if (!standard.includes(operation)) {
            extra.add(operation)
          }
        }
      }

      return {
        ...entry,
        operations: [...standard, ...[...extra].sort()],
      }
    })
}

/**
 * Toggles one cell. Selecting a non-read cell also selects the resource's read
 * cell when it is grantable. Deselecting read is refused while any other cell
 * of the resource is selected. Ungrantable cells are never changed.
 */
export const toggleCell = (
  matrix: MatrixGroup[],
  selection: Set<string>,
  policyId: string
) => {
  const next = new Set(selection)
  const found = findCell(matrix, policyId)

  if (!found || !found.cell.grantable) {
    return next
  }

  const { resource, cell } = found
  const operation = cell.policy.operation

  if (next.has(policyId)) {
    if (operation === READ && hasOtherSelected(resource, next, READ)) {
      return next
    }

    next.delete(policyId)
    return next
  }

  next.add(policyId)

  const read = resource.cells[READ]
  if (operation !== READ && read?.grantable) {
    next.add(read.policy.id)
  }

  return next
}

/**
 * Sets the level of a group. Only grantable cells are changed: `view` keeps
 * just the read cells selected, `full` selects every cell.
 */
export const setGroupLevel = (
  group: MatrixGroup,
  selection: Set<string>,
  level: Exclude<GroupLevel, "mixed">
) => {
  const next = new Set(selection)

  for (const [operation, cell] of groupCellsWithOperation(group)) {
    if (!cell.grantable) {
      continue
    }

    const selected =
      level === "full" || (level === "view" && operation === READ)

    if (selected) {
      next.add(cell.policy.id)
    } else {
      next.delete(cell.policy.id)
    }
  }

  return next
}

function groupCellsWithOperation(group: MatrixGroup) {
  return group.resources.flatMap((resource) => Object.entries(resource.cells))
}

/**
 * Toggles an operation for every resource in the group: deselects when all
 * grantable cells are selected (keeping read where the resource has other
 * cells selected), selects them all otherwise.
 */
export const toggleColumn = (
  group: MatrixGroup,
  selection: Set<string>,
  operation: string
) => {
  const next = new Set(selection)

  const rows = group.resources.filter((resource) => {
    return resource.cells[operation]?.grantable
  })

  if (!rows.length) {
    return next
  }

  const allSelected = rows.every((resource) =>
    selection.has(resource.cells[operation].policy.id)
  )

  for (const resource of rows) {
    const cell = resource.cells[operation]

    if (allSelected) {
      if (operation === READ && hasOtherSelected(resource, next, READ)) {
        continue
      }
      next.delete(cell.policy.id)
      continue
    }

    next.add(cell.policy.id)

    const read = resource.cells[READ]
    if (operation !== READ && read?.grantable) {
      next.add(read.policy.id)
    }
  }

  return next
}

const grantableCellsOf = (resource: MatrixResource) =>
  cellsOf(resource).filter((cell) => cell.grantable)

/**
 * Returns the select-all state of a resource row, looking at its grantable
 * cells only: `true` when all are selected, `false` when none are (or there
 * are none), `"indeterminate"` otherwise.
 */
export const getRowState = (
  resource: MatrixResource,
  selection: Set<string>
): boolean | "indeterminate" => {
  const cells = grantableCellsOf(resource)
  const selected = cells.filter((cell) => selection.has(cell.policy.id)).length

  if (selected === 0) {
    return false
  }

  return selected === cells.length ? true : "indeterminate"
}

/**
 * Toggles every grantable cell of a resource: deselects them all (including
 * read) when all are selected, selects them all otherwise. Ungrantable cells
 * are never changed.
 */
export const toggleRow = (resource: MatrixResource, selection: Set<string>) => {
  const next = new Set(selection)
  const cells = grantableCellsOf(resource)

  if (!cells.length) {
    return next
  }

  const allSelected = getRowState(resource, selection) === true

  for (const cell of cells) {
    if (allSelected) {
      next.delete(cell.policy.id)
    } else {
      next.add(cell.policy.id)
    }
  }

  return next
}

/**
 * Replaces the selection with a template. Ids that are not matrix cells
 * (wildcards, unknown ids) and selected ungrantable cells are carried over.
 */
export const applyTemplate = (
  matrix: MatrixGroup[],
  selection: Set<string>,
  template: SelectionTemplate
) => {
  const cells = matrixCellsOf(matrix)
  const cellIds = new Set(cells.map((cell) => cell.policy.id))

  const next = new Set([...selection].filter((id) => !cellIds.has(id)))

  for (const cell of cells) {
    if (!cell.grantable) {
      if (selection.has(cell.policy.id)) {
        next.add(cell.policy.id)
      }
      continue
    }

    if (template === "full" || cell.policy.operation === READ) {
      next.add(cell.policy.id)
    }
  }

  return next
}

/**
 * Removes every grantable cell from the selection. Selected ungrantable cells
 * and ids that are not in the matrix stay.
 */
export const clearSelection = (
  matrix: MatrixGroup[],
  selection: Set<string>
) => {
  const next = new Set(selection)

  for (const cell of matrixCellsOf(matrix)) {
    if (cell.grantable) {
      next.delete(cell.policy.id)
    }
  }

  return next
}

const levelOf = (cells: [string, MatrixCell][], selection: Set<string>) => {
  const selected = cells.filter(([, cell]) => selection.has(cell.policy.id))

  if (!selected.length) {
    return "none"
  }

  if (selected.length === cells.length) {
    return "full"
  }

  const reads = cells.filter(([operation]) => operation === READ)
  const selectedOthers = selected.filter(([operation]) => operation !== READ)

  if (!selectedOthers.length && selected.length === reads.length) {
    return "view"
  }

  return "mixed"
}

/**
 * The true level of a group, calculated over all of its cells.
 */
export const getGroupLevel = (
  group: MatrixGroup,
  selection: Set<string>
): GroupLevel => levelOf(groupCellsWithOperation(group), selection)

/**
 * The level of a group calculated over its grantable cells only. This is what
 * the level control shows, since it can only change those.
 */
export const getGroupControlLevel = (
  group: MatrixGroup,
  selection: Set<string>
): GroupLevel =>
  levelOf(
    groupCellsWithOperation(group).filter(([, cell]) => cell.grantable),
    selection
  )

export const getGroupCounts = (group: MatrixGroup, selection: Set<string>) => {
  const cells = groupCellsOf(group)

  return {
    selected: cells.filter((cell) => selection.has(cell.policy.id)).length,
    total: cells.length,
    locked: cells.filter((cell) => !cell.grantable).length,
  }
}

/**
 * Whether the resource has other cells selected while its read cell is not.
 */
export const hasViewWarning = (
  resource: MatrixResource,
  selection: Set<string>
) => {
  const read = resource.cells[READ]

  return (
    !!read &&
    !selection.has(read.policy.id) &&
    hasOtherSelected(resource, selection, READ)
  )
}

/**
 * Computes the policies to add to and remove from a role. Policies the actor
 * cannot assign are never removed.
 */
export const diffSelection = (
  initialIds: Iterable<string>,
  selection: Set<string>,
  assignableIds: Set<string>
) => {
  const initial = new Set(initialIds)

  return {
    toAdd: [...selection].filter((id) => !initial.has(id)),
    toRemove: [...initial].filter(
      (id) => assignableIds.has(id) && !selection.has(id)
    ),
  }
}

const normalizeQuery = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\s_]+/g, " ")
    .trim()

/**
 * Filters the matrix by a search query, matching group labels, resource labels
 * and resource keys. A matching group keeps all of its resources.
 */
export const filterMatrix = (
  matrix: MatrixGroup[],
  query: string,
  labels: {
    group: (id: string) => string
    resource: (resource: string) => string
  }
) => {
  const q = normalizeQuery(query)

  if (!q) {
    return matrix
  }

  const matches = (value: string) => normalizeQuery(value).includes(q)

  return matrix
    .map((group) => {
      if (matches(labels.group(group.id))) {
        return group
      }

      return {
        ...group,
        resources: group.resources.filter(
          (resource) =>
            matches(labels.resource(resource.resource)) ||
            matches(resource.resource)
        ),
      }
    })
    .filter((group) => group.resources.length > 0)
}

export type RoleGroupSummary = {
  id: string
  level: GroupLevel
  /** Number of the role's non-wildcard policies in this group. */
  selected: number
  /** Expected size of the group: its mapped resources times the four standard operations. For the Custom group, the number of custom policies that exist, or undefined when the full policy list was not given. */
  total?: number
  /** Resources in this group the role has at least one policy for, in map order (Custom: sorted by name). */
  resources: {
    resource: string
    operations: string[]
    hasViewWarning: boolean
  }[]
  /** Resources in this group the role has no policy for. */
  withoutAccess: string[]
}

/**
 * The concrete policies a set of policies effectively grants: the non-wildcard
 * ones as they are, plus every policy in `allPolicies` that one of the
 * wildcards (`*:*`, `resource:*`, `*:operation`) matches.
 */
export const expandWildcardPolicies = (
  policies: MatrixPolicy[],
  allPolicies: MatrixPolicy[]
): MatrixPolicy[] => {
  const wildcards = getWildcardPolicies(policies)
  const granted = (policy: MatrixPolicy) =>
    wildcards.some(
      (wildcard) =>
        (wildcard.resource === "*" || wildcard.resource === policy.resource) &&
        (wildcard.operation === "*" || wildcard.operation === policy.operation)
    )

  const byId = new Map<string, MatrixPolicy>()

  for (const policy of policies) {
    if (!isWildcard(policy)) {
      byId.set(policy.id, policy)
    }
  }

  for (const policy of allPolicies) {
    if (!isWildcard(policy) && granted(policy)) {
      byId.set(policy.id, policy)
    }
  }

  return [...byId.values()]
}

/**
 * Summarizes the policies a role holds per group. Group levels are measured
 * against the group's mapped resources times the four standard operations,
 * so mapped groups need no more than the role's own policies. The Custom group
 * has no such map: pass `allPolicies` to measure it against every custom
 * policy that exists and to list it even when the role holds none of them.
 * Without it, Custom only covers what the role holds. Wildcard policies are
 * ignored, use `getWildcardPolicies` for those.
 */
export const summarizeRolePolicies = (
  policies: MatrixPolicy[],
  allPolicies?: MatrixPolicy[]
): RoleGroupSummary[] => {
  const operationsByResource = new Map<string, Set<string>>()

  for (const policy of policies) {
    if (isWildcard(policy)) {
      continue
    }

    let operations = operationsByResource.get(policy.resource)
    if (!operations) {
      operations = new Set()
      operationsByResource.set(policy.resource, operations)
    }
    operations.add(policy.operation)
  }

  const standard: string[] = [...MATRIX_OPERATIONS]

  const toResources = (names: string[]) =>
    names
      .filter((name) => operationsByResource.has(name))
      .map((resource) => {
        const held = operationsByResource.get(resource)!

        return {
          resource,
          operations: [
            ...standard.filter((operation) => held.has(operation)),
            ...[...held]
              .filter((operation) => !standard.includes(operation))
              .sort(),
          ],
          hasViewWarning: !held.has(READ),
        }
      })

  const countOf = (resources: { operations: string[] }[]) =>
    resources.reduce((sum, { operations }) => sum + operations.length, 0)

  const summaries: RoleGroupSummary[] = PERMISSION_GROUPS.map(
    ({ id, resources: names }) => {
      const resources = toResources(names)
      const selected = countOf(resources)
      const total = names.length * standard.length

      const standardHeld = resources.reduce(
        (sum, { operations }) =>
          sum +
          operations.filter((operation) => standard.includes(operation)).length,
        0
      )
      const readHeld = resources.filter(({ operations }) =>
        operations.includes(READ)
      ).length

      let level: GroupLevel = "mixed"
      if (selected === 0) {
        level = "none"
      } else if (standardHeld === total) {
        level = "full"
      } else if (selected === names.length && readHeld === names.length) {
        level = "view"
      }

      return {
        id,
        level,
        selected,
        total,
        resources,
        withoutAccess: names.filter((name) => !operationsByResource.has(name)),
      }
    }
  )

  const mapped = new Set(PERMISSION_GROUPS.flatMap((group) => group.resources))
  const isCustom = (policy: MatrixPolicy) =>
    !isWildcard(policy) && !mapped.has(policy.resource)

  // Keyed by resource and operation, so a policy the role holds is not
  // counted twice when it is also in the full list.
  const customKeys = new Set(
    [...policies, ...(allPolicies ?? [])]
      .filter(isCustom)
      .map((policy) => `${policy.resource}:${policy.operation}`)
  )
  const customNames = [
    ...new Set([...customKeys].map((key) => key.split(":")[0])),
  ].sort((a, b) => a.localeCompare(b))

  if (customNames.length) {
    const resources = toResources(customNames)
    const selected = countOf(resources)
    const readTotal = [...customKeys].filter((key) =>
      key.endsWith(`:${READ}`)
    ).length
    const onlyRead = resources.every(
      ({ operations }) => operations.length === 1 && operations[0] === READ
    )

    let level: GroupLevel = "mixed"
    if (allPolicies) {
      if (selected === 0) {
        level = "none"
      } else if (selected === customKeys.size) {
        level = "full"
      } else if (onlyRead && selected === readTotal) {
        level = "view"
      }
    }

    summaries.push({
      id: CUSTOM_GROUP_ID,
      level,
      selected,
      total: allPolicies ? customKeys.size : undefined,
      resources,
      withoutAccess: customNames.filter(
        (name) => !operationsByResource.has(name)
      ),
    })
  }

  return summaries
}
