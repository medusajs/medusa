type FulfillmentLocation = { id: string } | { id: string }[] | null | undefined

export function getInitialFulfillmentLocationId(
  location: FulfillmentLocation,
  selectedLocationId?: string
) {
  if (selectedLocationId) {
    return selectedLocationId
  }

  return Array.isArray(location) ? location[0]?.id : location?.id
}
