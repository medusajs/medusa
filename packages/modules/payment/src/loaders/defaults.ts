import {
  CreatePaymentProviderDTO,
  LoaderOptions
} from "@medusajs/types"

export default async ({ container }: LoaderOptions): Promise<void> => {
  const providersToLoad = container.resolve("payment_providers")
  const paymentProviderService = container.resolve("paymentProviderService")

  const providers = await paymentProviderService.list({
    id: providersToLoad,
  })

  const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]))

  const providersToCreate: CreatePaymentProviderDTO[] = []
  for (const id of providersToLoad) {
    if (loadedProvidersMap.has(id)) {
      continue
    }

    providersToCreate.push({ id })
  }

  await paymentProviderService.create(providersToCreate)
}
