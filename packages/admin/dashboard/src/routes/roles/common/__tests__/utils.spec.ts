import { CORE_POLICY_RESOURCES } from "@medusajs/types"
import { describe, expect, it } from "vitest"

import {
  CUSTOM_GROUP_ID,
  MATRIX_OPERATIONS,
  PERMISSION_GROUPS,
} from "../constants"
import {
  MatrixGroup,
  MatrixPolicy,
  applyTemplate,
  buildMatrix,
  clearSelection,
  diffSelection,
  expandWildcardPolicies,
  filterMatrix,
  formatFallbackLabel,
  getGroupControlLevel,
  getGroupCounts,
  getGroupLevel,
  getRowState,
  getWildcardPolicies,
  hasViewWarning,
  setGroupLevel,
  summarizeRolePolicies,
  toggleCell,
  toggleColumn,
  toggleRow,
} from "../utils"

const policy = (resource: string, operation: string): MatrixPolicy => ({
  id: `${resource}_${operation}`,
  key: `${resource}:${operation}`,
  resource,
  operation,
})

const forResource = (resource: string, operations = MATRIX_OPERATIONS) =>
  operations.map((operation) => policy(resource, operation))

const ids = (policies: MatrixPolicy[]) => new Set(policies.map((p) => p.id))

const group = (matrix: MatrixGroup[], id: string) => {
  const found = matrix.find((g) => g.id === id)
  if (!found) {
    throw new Error(`group ${id} not found`)
  }
  return found
}

const labels = {
  group: (id: string) => ({ orders: "Orders", custom: "Custom" })[id] ?? id,
  resource: (resource: string) =>
    ({ order: "Orders", order_item: "Order items" })[resource] ?? resource,
}

describe("PERMISSION_GROUPS", () => {
  it("places every core resource in exactly one group", () => {
    const all = PERMISSION_GROUPS.flatMap((g) => g.resources)

    for (const resource of CORE_POLICY_RESOURCES) {
      expect(all.filter((r) => r === resource)).toHaveLength(1)
    }

    expect(all).toHaveLength(CORE_POLICY_RESOURCES.length)
  })
})

describe("buildMatrix", () => {
  it("follows the group map order and drops empty groups", () => {
    const policies = [
      ...forResource("customer"),
      ...forResource("order_item"),
      ...forResource("order"),
    ]
    const matrix = buildMatrix(policies, ids(policies))

    expect(matrix.map((g) => g.id)).toEqual(["orders", "customers"])
    expect(group(matrix, "orders").resources.map((r) => r.resource)).toEqual([
      "order",
      "order_item",
    ])
  })

  it("puts unmapped resources in Custom, sorted by name", () => {
    const policies = [
      ...forResource("zebra"),
      ...forResource("order"),
      ...forResource("brand"),
    ]
    const matrix = buildMatrix(policies, ids(policies))

    expect(matrix[matrix.length - 1].id).toBe(CUSTOM_GROUP_ID)
    expect(
      group(matrix, CUSTOM_GROUP_ID).resources.map((r) => r.resource)
    ).toEqual(["brand", "zebra"])
  })

  it("leaves wildcard policies out and returns them separately", () => {
    const wildcards = [
      policy("*", "*"),
      policy("product", "*"),
      policy("*", "read"),
    ]
    const policies = [...wildcards, ...forResource("product")]
    const matrix = buildMatrix(policies, ids(policies))

    const matrixIds = matrix.flatMap((g) =>
      g.resources.flatMap((r) => Object.values(r.cells).map((c) => c.policy.id))
    )

    for (const wildcard of wildcards) {
      expect(matrixIds).not.toContain(wildcard.id)
    }
    expect(getWildcardPolicies(policies)).toEqual(wildcards)
  })

  it("adds a custom operation as a column to its own group only", () => {
    const policies = [
      ...forResource("order"),
      policy("order", "refund"),
      ...forResource("customer"),
      ...forResource("brand"),
      policy("brand", "approve"),
      policy("brand", "archive"),
    ]
    const matrix = buildMatrix(policies, ids(policies))

    expect(group(matrix, "orders").operations).toEqual([
      "read",
      "create",
      "update",
      "delete",
      "refund",
    ])
    expect(group(matrix, "customers").operations).toEqual([
      ...MATRIX_OPERATIONS,
    ])
    expect(group(matrix, CUSTOM_GROUP_ID).operations).toEqual([
      "read",
      "create",
      "update",
      "delete",
      "approve",
      "archive",
    ])
  })

  it("keeps the first policy when a resource and operation repeat", () => {
    const first = policy("order", "read")
    const duplicate = { ...first, id: "other" }
    const matrix = buildMatrix([first, duplicate], ids([first, duplicate]))

    expect(group(matrix, "orders").resources[0].cells.read.policy.id).toBe(
      first.id
    )
  })

  it("marks cells grantable from the assignable ids", () => {
    const policies = forResource("order")
    const matrix = buildMatrix(policies, new Set(["order_read"]))
    const cells = group(matrix, "orders").resources[0].cells

    expect(cells.read.grantable).toBe(true)
    expect(cells.create.grantable).toBe(false)
  })
})

describe("toggleCell", () => {
  const policies = [...forResource("order"), policy("payment", "create")]
  const matrix = buildMatrix(policies, ids(policies))

  it("adds view together with create", () => {
    const next = toggleCell(matrix, new Set(), "order_create")

    expect(next).toEqual(new Set(["order_create", "order_read"]))
  })

  it("refuses to remove view while create is selected", () => {
    const selection = new Set(["order_create", "order_read"])
    const next = toggleCell(matrix, selection, "order_read")

    expect(next).toEqual(selection)
  })

  it("removes view once the other cells are gone", () => {
    const selection = new Set(["order_create", "order_read"])
    const next = toggleCell(
      matrix,
      toggleCell(matrix, selection, "order_create"),
      "order_read"
    )

    expect(next.size).toBe(0)
  })

  it("accepts other operations on a resource without a read policy", () => {
    const next = toggleCell(matrix, new Set(), "payment_create")

    expect(next).toEqual(new Set(["payment_create"]))
    expect(toggleCell(matrix, next, "payment_create").size).toBe(0)
  })

  it("never changes ungrantable cells", () => {
    const locked = buildMatrix(policies, new Set(["order_read"]))

    expect(toggleCell(locked, new Set(), "order_create").size).toBe(0)
  })

  it("does not select view when it is ungrantable", () => {
    const noRead = buildMatrix(policies, new Set(["order_create"]))

    expect(toggleCell(noRead, new Set(), "order_create")).toEqual(
      new Set(["order_create"])
    )
  })

  it("does not mutate its input", () => {
    const selection = new Set<string>()
    toggleCell(matrix, selection, "order_create")

    expect(selection.size).toBe(0)
  })
})

describe("group levels", () => {
  const policies = [...forResource("order"), ...forResource("order_item")]
  const assignable = ids(policies)
  const matrix = buildMatrix(policies, assignable)
  const orders = group(matrix, "orders")

  it("sets none, view and full", () => {
    const full = setGroupLevel(orders, new Set(), "full")
    expect(full.size).toBe(8)
    expect(getGroupLevel(orders, full)).toBe("full")

    const view = setGroupLevel(orders, full, "view")
    expect(view).toEqual(new Set(["order_read", "order_item_read"]))
    expect(getGroupLevel(orders, view)).toBe("view")

    const none = setGroupLevel(orders, view, "none")
    expect(none.size).toBe(0)
    expect(getGroupLevel(orders, none)).toBe("none")
  })

  it("reports mixed for any other combination", () => {
    expect(getGroupLevel(orders, new Set(["order_create"]))).toBe("mixed")
    expect(getGroupLevel(orders, new Set(["order_read"]))).toBe("mixed")
  })

  it("reports full on grantable cells while the true level is mixed", () => {
    const partial = buildMatrix(
      policies,
      new Set(["order_read", "order_create"])
    )
    const g = group(partial, "orders")
    const selection = setGroupLevel(g, new Set(), "full")

    expect(selection).toEqual(new Set(["order_read", "order_create"]))
    expect(getGroupControlLevel(g, selection)).toBe("full")
    expect(getGroupLevel(g, selection)).toBe("mixed")
  })

  it("reports none on the control when no grantable cell is selected", () => {
    const locked = buildMatrix(policies, new Set())
    const g = group(locked, "orders")

    expect(getGroupControlLevel(g, new Set(["order_read"]))).toBe("none")
  })

  it("only changes grantable cells and keeps locked ones and wildcards", () => {
    const partial = buildMatrix(policies, new Set(["order_read"]))
    const g = group(partial, "orders")
    const selection = new Set(["order_create", "wild"])

    const view = setGroupLevel(g, selection, "view")
    expect(view).toEqual(new Set(["order_create", "wild", "order_read"]))

    const none = setGroupLevel(g, view, "none")
    expect(none).toEqual(new Set(["order_create", "wild"]))
  })

  it("counts selected, total and locked cells", () => {
    const partial = buildMatrix(policies, new Set(["order_read"]))
    const g = group(partial, "orders")

    expect(getGroupCounts(g, new Set(["order_read", "order_create"]))).toEqual({
      selected: 2,
      total: 8,
      locked: 7,
    })
  })

  it("does not mutate its input", () => {
    const selection = new Set(["order_read"])
    setGroupLevel(orders, selection, "full")

    expect(selection).toEqual(new Set(["order_read"]))
  })
})

describe("toggleColumn", () => {
  const policies = [...forResource("order"), ...forResource("order_item")]
  const matrix = buildMatrix(policies, ids(policies))
  const orders = group(matrix, "orders")

  it("selects a column and the view cells it needs", () => {
    const next = toggleColumn(orders, new Set(), "update")

    expect(next).toEqual(
      new Set([
        "order_update",
        "order_item_update",
        "order_read",
        "order_item_read",
      ])
    )
  })

  it("deselects a column when every cell is selected", () => {
    const on = toggleColumn(orders, new Set(), "update")
    const off = toggleColumn(orders, on, "update")

    expect(off).toEqual(new Set(["order_read", "order_item_read"]))
  })

  it("skips view cells whose resource has other cells selected", () => {
    const selection = new Set(["order_read", "order_item_read", "order_create"])
    const next = toggleColumn(orders, selection, "read")

    expect(next).toEqual(new Set(["order_read", "order_create"]))
  })

  it("ignores ungrantable cells", () => {
    const partial = buildMatrix(
      policies,
      new Set(["order_update", "order_read"])
    )
    const g = group(partial, "orders")

    expect(toggleColumn(g, new Set(), "update")).toEqual(
      new Set(["order_update", "order_read"])
    )
  })
})

describe("getRowState and toggleRow", () => {
  const policies = forResource("order")
  const row = (assignable: string[] = [...ids(policies)]) =>
    buildMatrix(policies, new Set(assignable))[0].resources[0]

  it("selects every cell when none is selected", () => {
    const resource = row()

    expect(getRowState(resource, new Set())).toBe(false)
    expect(toggleRow(resource, new Set())).toEqual(ids(policies))
  })

  it("selects every cell when some are selected", () => {
    const resource = row()
    const selection = new Set(["order_read", "order_update"])

    expect(getRowState(resource, selection)).toBe("indeterminate")
    expect(toggleRow(resource, selection)).toEqual(ids(policies))
  })

  it("deselects every cell, read included, when all are selected", () => {
    const resource = row()
    const all = ids(policies)

    expect(getRowState(resource, all)).toBe(true)
    expect(toggleRow(resource, all)).toEqual(new Set())
  })

  it("never changes ungrantable cells", () => {
    const resource = row(["order_read", "order_update"])

    // order_create is ungrantable but selected, order_delete is not.
    const selection = new Set(["order_create"])
    const selected = toggleRow(resource, selection)

    expect(selected).toEqual(
      new Set(["order_create", "order_read", "order_update"])
    )
    expect(getRowState(resource, selected)).toBe(true)

    const cleared = toggleRow(resource, selected)

    expect(cleared).toEqual(new Set(["order_create"]))
    expect(cleared.has("order_delete")).toBe(false)
  })

  it("leaves a row without grantable cells unchanged", () => {
    const resource = row([])
    const selection = new Set(["order_read"])

    expect(getRowState(resource, selection)).toBe(false)
    expect(toggleRow(resource, selection)).toEqual(selection)
  })

  it("does not mutate the input", () => {
    const resource = row()
    const selection = new Set(["order_read"])

    const next = toggleRow(resource, selection)

    expect(next).not.toBe(selection)
    expect(selection).toEqual(new Set(["order_read"]))
  })
})

describe("templates and clearing", () => {
  const policies = [
    ...forResource("order"),
    ...forResource("customer"),
    policy("*", "*"),
  ]
  const matrix = buildMatrix(
    policies,
    new Set(
      policies
        .filter((p) => p.id !== "customer_delete" && p.resource !== "*")
        .map((p) => p.id)
    )
  )

  it("full selects every grantable cell and skips wildcards", () => {
    const next = applyTemplate(matrix, new Set(), "full")

    expect(next.size).toBe(7)
    expect(next.has("customer_delete")).toBe(false)
    expect(next.has("*_*")).toBe(false)
  })

  it("readonly selects grantable read cells only", () => {
    expect(
      applyTemplate(matrix, new Set(["order_delete"]), "readonly")
    ).toEqual(new Set(["order_read", "customer_read"]))
  })

  it("carries over locked cells and ids outside the matrix", () => {
    const next = applyTemplate(
      matrix,
      new Set(["customer_delete", "*_*"]),
      "readonly"
    )

    expect(next).toEqual(
      new Set(["customer_delete", "*_*", "order_read", "customer_read"])
    )
  })

  it("clearSelection keeps locked ids and ids outside the matrix", () => {
    const selection = new Set(["order_read", "customer_delete", "*_*", "x"])

    expect(clearSelection(matrix, selection)).toEqual(
      new Set(["customer_delete", "*_*", "x"])
    )
    expect(selection.size).toBe(4)
  })

  it("wildcard ids survive group level changes", () => {
    const selection = new Set(["*_*"])
    const g = group(matrix, "orders")

    expect(setGroupLevel(g, selection, "full").has("*_*")).toBe(true)
    expect(setGroupLevel(g, selection, "none").has("*_*")).toBe(true)
  })
})

describe("hasViewWarning", () => {
  const matrix = buildMatrix(forResource("order"), ids(forResource("order")))
  const resource = group(matrix, "orders").resources[0]
  const noRead = buildMatrix([policy("payment", "create")], new Set())
  const paymentResource = group(noRead, "payments").resources[0]

  it("warns when other cells are selected without view", () => {
    expect(hasViewWarning(resource, new Set(["order_update"]))).toBe(true)
  })

  it("does not warn with view selected, nothing selected, or no view cell", () => {
    expect(
      hasViewWarning(resource, new Set(["order_update", "order_read"]))
    ).toBe(false)
    expect(hasViewWarning(resource, new Set())).toBe(false)
    expect(hasViewWarning(paymentResource, new Set(["payment_create"]))).toBe(
      false
    )
  })
})

describe("diffSelection", () => {
  it("returns additions and removals", () => {
    expect(
      diffSelection(["a", "b"], new Set(["b", "c"]), new Set(["a", "b", "c"]))
    ).toEqual({ toAdd: ["c"], toRemove: ["a"] })
  })

  it("never removes a non-assignable id", () => {
    const { toRemove } = diffSelection(
      ["a", "locked", "*_*"],
      new Set(),
      new Set(["a"])
    )

    expect(toRemove).toEqual(["a"])
  })

  it("keeps wildcard ids selected through the matrix functions", () => {
    const policies = [...forResource("order"), policy("*", "*")]
    const matrix = buildMatrix(policies, ids(policies.slice(0, 4)))
    const initial = ["*_*", "order_read"]
    const selection = clearSelection(matrix, new Set(initial))
    const { toRemove } = diffSelection(
      initial,
      selection,
      ids(policies.slice(0, 4))
    )

    expect(selection.has("*_*")).toBe(true)
    expect(toRemove).toEqual(["order_read"])
  })
})

describe("filterMatrix", () => {
  const policies = [
    ...forResource("order"),
    ...forResource("order_item"),
    ...forResource("customer"),
    ...forResource("brand"),
  ]
  const matrix = buildMatrix(policies, ids(policies))
  const resourcesOf = (m: MatrixGroup[]) =>
    m.flatMap((g) => g.resources.map((r) => r.resource))

  it("returns the matrix unchanged for an empty query", () => {
    expect(filterMatrix(matrix, "  ", labels)).toBe(matrix)
  })

  it("keeps every resource of a group whose label matches", () => {
    const result = filterMatrix(matrix, "ORDERS", labels)

    expect(result.map((g) => g.id)).toEqual(["orders"])
    expect(resourcesOf(result)).toEqual(["order", "order_item"])
  })

  it("matches resource labels", () => {
    expect(resourcesOf(filterMatrix(matrix, "order items", labels))).toEqual([
      "order_item",
    ])
  })

  it("matches resource keys, treating spaces and underscores alike", () => {
    expect(resourcesOf(filterMatrix(matrix, "order_item", labels))).toEqual([
      "order_item",
    ])
    expect(resourcesOf(filterMatrix(matrix, "brand", labels))).toEqual([
      "brand",
    ])
  })

  it("drops groups left empty", () => {
    expect(filterMatrix(matrix, "nothing like this", labels)).toEqual([])
  })
})

describe("formatFallbackLabel", () => {
  it("replaces underscores and capitalizes the first letter", () => {
    expect(formatFallbackLabel("order_item")).toBe("Order item")
    expect(formatFallbackLabel("approve")).toBe("Approve")
    expect(formatFallbackLabel("")).toBe("")
  })
})

describe("expandWildcardPolicies", () => {
  const all = [
    ...forResource("product"),
    policy("order", "read"),
    policy("order", "update"),
    policy("report", "export"),
    policy("*", "*"),
  ]
  const keys = (policies: MatrixPolicy[]) => policies.map((p) => p.key).sort()

  it("returns the concrete policies as they are without wildcards", () => {
    const held = [policy("product", "read")]

    expect(expandWildcardPolicies(held, all)).toEqual(held)
  })

  it("expands *:* to every concrete policy", () => {
    const expanded = expandWildcardPolicies([policy("*", "*")], all)

    expect(keys(expanded)).toEqual(keys(all.filter((p) => p.resource !== "*")))
  })

  it("expands a resource wildcard to that resource only", () => {
    const expanded = expandWildcardPolicies([policy("order", "*")], all)

    expect(keys(expanded)).toEqual(["order:read", "order:update"])
  })

  it("expands an operation wildcard across resources and keeps held policies", () => {
    const expanded = expandWildcardPolicies(
      [policy("*", "read"), policy("report", "export")],
      all
    )

    expect(keys(expanded)).toEqual([
      "order:read",
      "product:read",
      "report:export",
    ])
  })
})

describe("summarizeRolePolicies", () => {
  const inventory = PERMISSION_GROUPS.find((g) => g.id === "inventory")!
  const summaryOf = (policies: MatrixPolicy[], id: string) => {
    const found = summarizeRolePolicies(policies).find((g) => g.id === id)
    if (!found) {
      throw new Error(`group ${id} not found`)
    }
    return found
  }

  it("always returns every mapped group in order, with no access when empty", () => {
    const summaries = summarizeRolePolicies([])

    expect(summaries.map((g) => g.id)).toEqual(
      PERMISSION_GROUPS.map((g) => g.id)
    )
    for (const summary of summaries) {
      expect(summary.level).toBe("none")
      expect(summary.selected).toBe(0)
      expect(summary.resources).toEqual([])
    }
  })

  it("sets total to resources times the standard operations and lists resources without access", () => {
    const summary = summaryOf([], "inventory")

    expect(summary.total).toBe(inventory.resources.length * 4)
    expect(summary.withoutAccess).toEqual(inventory.resources)
  })

  it("reports view when the role has exactly every read cell of the group", () => {
    const policies = inventory.resources.map((r) => policy(r, "read"))
    const summary = summaryOf(policies, "inventory")

    expect(summary.level).toBe("view")
    expect(summary.selected).toBe(inventory.resources.length)
    expect(summary.withoutAccess).toEqual([])
  })

  it("reports full when the role has every expected cell", () => {
    const policies = inventory.resources.flatMap((r) => forResource(r))
    const summary = summaryOf(policies, "inventory")

    expect(summary.level).toBe("full")
    expect(summary.selected).toBe(inventory.resources.length * 4)
  })

  it("does not downgrade full for extra custom operations", () => {
    const policies = [
      ...inventory.resources.flatMap((r) => forResource(r)),
      policy("inventory_item", "export"),
    ]
    const summary = summaryOf(policies, "inventory")

    expect(summary.level).toBe("full")
    expect(summary.selected).toBe(inventory.resources.length * 4 + 1)
  })

  it("reports mixed for partial access", () => {
    const summary = summaryOf(
      [policy("inventory_item", "read"), policy("inventory_item", "create")],
      "inventory"
    )

    expect(summary.level).toBe("mixed")
    expect(summary.selected).toBe(2)
    expect(summary.withoutAccess).toEqual(
      inventory.resources.filter((r) => r !== "inventory_item")
    )
  })

  it("reports mixed when only some resources have read", () => {
    const summary = summaryOf([policy("inventory_item", "read")], "inventory")

    expect(summary.level).toBe("mixed")
  })

  it("treats a custom operation on a mapped resource as mixed and prevents view", () => {
    const policies = [
      ...inventory.resources.map((r) => policy(r, "read")),
      policy("inventory_item", "export"),
    ]
    const summary = summaryOf(policies, "inventory")

    expect(summary.level).toBe("mixed")
    expect(summary.selected).toBe(inventory.resources.length + 1)
  })

  it("puts unmapped resources in a trailing Custom group sorted by name", () => {
    const summaries = summarizeRolePolicies([
      policy("zebra", "read"),
      policy("alpha", "export"),
      policy("alpha", "read"),
    ])
    const custom = summaries[summaries.length - 1]

    expect(custom.id).toBe(CUSTOM_GROUP_ID)
    expect(custom.level).toBe("mixed")
    expect(custom.total).toBeUndefined()
    expect(custom.withoutAccess).toEqual([])
    expect(custom.selected).toBe(3)
    expect(custom.resources.map((r) => r.resource)).toEqual(["alpha", "zebra"])
    expect(summaries.filter((g) => g.id === CUSTOM_GROUP_ID)).toHaveLength(1)
  })

  it("omits the Custom group when there are no unmapped resources", () => {
    const summaries = summarizeRolePolicies([policy("product", "read")])

    expect(summaries.some((g) => g.id === CUSTOM_GROUP_ID)).toBe(false)
  })

  describe("with the full policy list", () => {
    const all = [
      ...forResource("product"),
      policy("*", "*"),
      policy("alpha", "read"),
      policy("alpha", "export"),
      policy("zebra", "read"),
    ]
    const customOf = (policies: MatrixPolicy[]) =>
      summarizeRolePolicies(policies, all).find(
        (g) => g.id === CUSTOM_GROUP_ID
      )!

    it("lists the Custom group with no access when the role holds no custom policy", () => {
      const custom = customOf([policy("product", "read")])

      expect(custom.level).toBe("none")
      expect(custom.selected).toBe(0)
      expect(custom.total).toBe(3)
      expect(custom.resources).toEqual([])
      expect(custom.withoutAccess).toEqual(["alpha", "zebra"])
    })

    it("omits the Custom group when no custom policy exists", () => {
      const summaries = summarizeRolePolicies(
        [policy("product", "read")],
        forResource("product")
      )

      expect(summaries.some((g) => g.id === CUSTOM_GROUP_ID)).toBe(false)
    })

    it("reports mixed with the resources the role has no access to", () => {
      const custom = customOf([policy("alpha", "export")])

      expect(custom.level).toBe("mixed")
      expect(custom.selected).toBe(1)
      expect(custom.withoutAccess).toEqual(["zebra"])
    })

    it("reports view when the role holds exactly every custom read policy", () => {
      const custom = customOf([
        policy("alpha", "read"),
        policy("zebra", "read"),
      ])

      expect(custom.level).toBe("view")
    })

    it("reports full when the role holds every custom policy", () => {
      const custom = customOf(all)

      expect(custom.level).toBe("full")
      expect(custom.selected).toBe(3)
    })

    it("counts a custom policy the role holds that is missing from the list", () => {
      const custom = customOf([policy("gamma", "read")])

      expect(custom.total).toBe(4)
      expect(custom.resources.map((r) => r.resource)).toEqual(["gamma"])
    })
  })

  it("ignores wildcard policies", () => {
    const summaries = summarizeRolePolicies([
      policy("*", "*"),
      policy("product", "*"),
      policy("*", "read"),
    ])

    expect(summaries.every((g) => g.selected === 0)).toBe(true)
    expect(summaries.some((g) => g.id === CUSTOM_GROUP_ID)).toBe(false)
  })

  it("orders resources by map order and operations standard first, then by name", () => {
    const summary = summaryOf(
      [
        policy("stock_location", "read"),
        policy("inventory_item", "zzz"),
        policy("inventory_item", "delete"),
        policy("inventory_item", "aaa"),
        policy("inventory_item", "read"),
      ],
      "inventory"
    )

    expect(summary.resources.map((r) => r.resource)).toEqual([
      "inventory_item",
      "stock_location",
    ])
    expect(summary.resources[0].operations).toEqual([
      "read",
      "delete",
      "aaa",
      "zzz",
    ])
  })

  it("flags a view warning when the resource has operations but not read", () => {
    const summary = summaryOf(
      [policy("inventory_item", "update"), policy("stock_location", "read")],
      "inventory"
    )

    expect(summary.resources).toEqual([
      {
        resource: "inventory_item",
        operations: ["update"],
        hasViewWarning: true,
      },
      {
        resource: "stock_location",
        operations: ["read"],
        hasViewWarning: false,
      },
    ])
  })
})
