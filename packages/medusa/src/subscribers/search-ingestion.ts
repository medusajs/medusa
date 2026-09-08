import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { Modules } from "@medusajs/framework/utils"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

export default async function searchIngestionHandler({
  event,
  container,
}: SubscriberArgs<unknown>) {
  const searchModule = container.resolve(Modules.SEARCH, {
    allowUnregistered: true,
  })

  if (!searchModule) {
    return
  }

  return await searchModule.ingest(event)
}

/**
 * Declared events only. A wildcard would deliver every event in the system here
 * just to be discarded.
 *
 * Read off the registry rather than the module, because a subscriber's config is
 * evaluated on import, before there is a container to reach the module through.
 */
export const config: SubscriberConfig = {
  event: [
    ...new Set(
      MedusaModule.getSearchIndexes().flatMap((index) => index.events ?? [])
    ),
  ],
  context: {
    subscriberId: "search-ingestion",
  },
}
