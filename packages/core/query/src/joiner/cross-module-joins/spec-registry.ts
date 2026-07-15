import { PushdownCandidate, SpecRegistry } from "./types"

/**
 * Merges a batch of pushdown candidates into the registry, deduplicating join
 * levels shared between paths and enforcing the DAL's unique-target-table
 * constraint. The batch is applied atomically: on any conflict the registry
 * is left untouched and false is returned.
 */
export function registerCandidates(
  registry: SpecRegistry,
  candidates: PushdownCandidate[]
): boolean {
  const additions: SpecRegistry = {}
  const usedTables = new Set(
    Object.values(registry).map((spec) => spec.target.table)
  )

  for (const candidate of candidates) {
    for (const level of candidate.levels) {
      if (registry[level.realPathKey] || additions[level.realPathKey]) {
        continue
      }

      if (usedTables.has(level.spec.target.table)) {
        return false
      }

      additions[level.realPathKey] = level.spec
      usedTables.add(level.spec.target.table)
    }
  }

  Object.assign(registry, additions)

  for (const candidate of candidates) {
    const leaf = candidate.levels[candidate.levels.length - 1]
    const spec = leaf && registry[leaf.realPathKey]

    if (spec && Object.keys(candidate.filters).length) {
      spec.target.filters = spec.target.filters
        ? { $and: [spec.target.filters, candidate.filters] }
        : candidate.filters
    }
  }

  return true
}
