import { Event, SearchTypes } from "@medusajs/framework/types"
import {
  SearchEventRoutes,
  SearchIndexes,
  SearchIngestionRuntime,
} from "@types"
import {
  assertTaskAccepted,
  resolveActiveDefinition,
  retrieveIndexDefinition,
} from "./index"

// Built once so routing a delivered event is a lookup, not a scan.
export function buildEventRoutes(indexes: SearchIndexes): SearchEventRoutes {
  const routes: SearchEventRoutes = new Map()

  for (const definition of indexes.values()) {
    for (const event of definition.events ?? []) {
      const names = routes.get(event)

      if (names) {
        names.push(definition.name)
      } else {
        routes.set(event, [definition.name])
      }
    }
  }

  return routes
}

/**
 * Turns one event into writes. Every write is waited on as far as its provider allows,
 * so awaiting this is an acknowledgement.
 */
export async function ingestEvent(
  context: SearchIngestionRuntime,
  { event, routes }: { event: Event<any>; routes: SearchEventRoutes }
): Promise<SearchTypes.SearchTask[]> {
  const names = routes.get(event.name)

  // Only reachable by a direct call — the subscriber enrolls in declared events.
  if (!names?.length) {
    return []
  }

  const tasks: SearchTypes.SearchTask[] = []

  for (const name of names) {
    const definition = retrieveIndexDefinition(context.indexes, name)
    // The active version, merged in — resolving `definition` alone would
    // target the never-queried root physical name.
    const active = await resolveActiveDefinition(context, name)
    const provider = context.providers.retrieve(active.provider)

    // Resolving a definition rejects `events` without `consume`, so there is one.
    const mutations = await definition.consume!(event, {
      container: context.container,
      index: definition,
    })

    for (const mutation of mutations) {
      if (mutation.action === "upsert" && !mutation.documents.length) {
        continue
      }

      const task =
        mutation.action === "upsert"
          ? await provider.upsertDocuments({
              index: active.physical_name,
              definition: active,
              documents: mutation.documents,
            })
          : await provider.deleteDocuments({
              index: active.physical_name,
              filters: mutation.filters,
            })

      tasks.push(
        await settleTask(provider, assertTaskAccepted(task, name), name)
      )
    }
  }

  return tasks
}

/**
 * A deferred write is not in the index yet, so waiting is what makes the result an
 * acknowledgement. Inline providers come back `succeeded` with nothing to wait for.
 */
async function settleTask(
  provider: SearchTypes.ISearchProvider,
  task: SearchTypes.SearchTask,
  index: string
): Promise<SearchTypes.SearchTask> {
  if (task.status === "succeeded" || !provider.waitForTask) {
    return task
  }

  return assertTaskAccepted(await provider.waitForTask(task), index)
}
