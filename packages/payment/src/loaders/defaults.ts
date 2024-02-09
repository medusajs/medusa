import { CreatePaymentProviderDTO, LoaderOptions } from "@medusajs/types"

export default async ({ container }: LoaderOptions): Promise<void> => {
  const providersToLoad = container["payment_providers"]
  const paymentProviderService = container.resolve("paymentProviderService")

  const providers_ = await paymentProviderService.list({
    // @ts-ignore TODO
    id: providersToLoad.map((p) => p.getIdentifier()),
  })

  const loadedProvidersMap = new Map(providers_.map((p) => [p.id, p]))
  const providersToCreate: CreatePaymentProviderDTO[] = []

  for (const provider of providersToLoad) {
    if (loadedProvidersMap.has(provider.getIdentifier())) {
      continue
    }

    providersToCreate.push({
      id: provider.getIdentifier(),
    })
  }

  await paymentProviderService.create(providersToCreate)
}
