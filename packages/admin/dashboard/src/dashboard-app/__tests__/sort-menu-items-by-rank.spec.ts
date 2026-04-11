import { describe, expect, it } from "vitest"
import { sortMenuItemsByRank } from "../utils/sort-menu-items-by-rank"
import { INavItem } from "../../components/layout/nav-item"

describe("sortMenuItemsByRank", () => {
  it("should sort items by rank in ascending order", () => {
    const items: INavItem[] = [
      { label: "Third", to: "/third", rank: 3 },
      { label: "First", to: "/first", rank: 1 },
      { label: "Second", to: "/second", rank: 2 },
    ]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted[0].label).toBe("First")
    expect(sorted[1].label).toBe("Second")
    expect(sorted[2].label).toBe("Third")
  })

  it("should place items with rank before items without rank", () => {
    const items: INavItem[] = [
      { label: "No Rank", to: "/no-rank" },
      { label: "Ranked 2", to: "/ranked-2", rank: 2 },
      { label: "Ranked 1", to: "/ranked-1", rank: 1 },
      { label: "Also No Rank", to: "/also-no-rank" },
    ]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted[0].label).toBe("Ranked 1")
    expect(sorted[1].label).toBe("Ranked 2")
    expect(sorted[2].label).toBe("No Rank")
    expect(sorted[3].label).toBe("Also No Rank")
  })

  it("should handle items with rank 0", () => {
    const items: INavItem[] = [
      { label: "Rank 2", to: "/rank-2", rank: 2 },
      { label: "Rank 0", to: "/rank-0", rank: 0 },
      { label: "Rank 1", to: "/rank-1", rank: 1 },
    ]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted[0].label).toBe("Rank 0")
    expect(sorted[1].label).toBe("Rank 1")
    expect(sorted[2].label).toBe("Rank 2")
  })

  it("should handle negative ranks", () => {
    const items: INavItem[] = [
      { label: "Rank 1", to: "/rank-1", rank: 1 },
      { label: "Rank -1", to: "/rank-minus-1", rank: -1 },
      { label: "Rank 0", to: "/rank-0", rank: 0 },
    ]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted[0].label).toBe("Rank -1")
    expect(sorted[1].label).toBe("Rank 0")
    expect(sorted[2].label).toBe("Rank 1")
  })

  it("should sort nested items independently", () => {
    const items: INavItem[] = [
      {
        label: "Parent 2",
        to: "/parent-2",
        rank: 2,
        items: [
          { label: "Child 2B", to: "/child-2b", rank: 2 },
          { label: "Child 2A", to: "/child-2a", rank: 1 },
        ],
      },
      {
        label: "Parent 1",
        to: "/parent-1",
        rank: 1,
        items: [
          { label: "Child 1C", to: "/child-1c", rank: 3 },
          { label: "Child 1A", to: "/child-1a", rank: 1 },
          { label: "Child 1B", to: "/child-1b", rank: 2 },
        ],
      },
    ]

    const sorted = sortMenuItemsByRank(items)

    // Parents should be sorted
    expect(sorted[0].label).toBe("Parent 1")
    expect(sorted[1].label).toBe("Parent 2")

    // Parent 1's children should be sorted
    expect(sorted[0].items![0].label).toBe("Child 1A")
    expect(sorted[0].items![1].label).toBe("Child 1B")
    expect(sorted[0].items![2].label).toBe("Child 1C")

    // Parent 2's children should be sorted
    expect(sorted[1].items![0].label).toBe("Child 2A")
    expect(sorted[1].items![1].label).toBe("Child 2B")
  })

  it("should handle nested items with mixed ranked and unranked", () => {
    const items: INavItem[] = [
      {
        label: "Parent",
        to: "/parent",
        rank: 1,
        items: [
          { label: "No Rank Child", to: "/no-rank" },
          { label: "Rank 1 Child", to: "/rank-1", rank: 1 },
          { label: "Rank 2 Child", to: "/rank-2", rank: 2 },
        ],
      },
    ]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted[0].items![0].label).toBe("Rank 1 Child")
    expect(sorted[0].items![1].label).toBe("Rank 2 Child")
    expect(sorted[0].items![2].label).toBe("No Rank Child")
  })

  it("should handle empty items array", () => {
    const items: INavItem[] = []

    const sorted = sortMenuItemsByRank(items)

    expect(sorted).toEqual([])
  })

  it("should handle single item", () => {
    const items: INavItem[] = [{ label: "Only Item", to: "/only", rank: 1 }]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted).toHaveLength(1)
    expect(sorted[0].label).toBe("Only Item")
  })

  it("should preserve items without nested arrays", () => {
    const items: INavItem[] = [
      { label: "Item 1", to: "/item-1", rank: 2 },
      { label: "Item 2", to: "/item-2", rank: 1 },
    ]

    const sorted = sortMenuItemsByRank(items)

    expect(sorted[0].items).toBeUndefined()
    expect(sorted[1].items).toBeUndefined()
  })

  it("should handle duplicate rank values", () => {
    const items: INavItem[] = [
      { label: "Item C", to: "/item-c", rank: 1 },
      { label: "Item A", to: "/item-a", rank: 1 },
      { label: "Item B", to: "/item-b", rank: 1 },
    ]

    const sorted = sortMenuItemsByRank(items)

    // All should have rank 1, order should be stable
    expect(sorted[0].rank).toBe(1)
    expect(sorted[1].rank).toBe(1)
    expect(sorted[2].rank).toBe(1)
    expect(sorted).toHaveLength(3)
  })
})

