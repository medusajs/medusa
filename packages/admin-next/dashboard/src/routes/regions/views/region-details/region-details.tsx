import { EllipsisHorizontal } from "@medusajs/icons"
import { Container, Heading, IconButton, Text, Tooltip } from "@medusajs/ui"
import { useAdminRegion } from "medusa-react"
import { useParams } from "react-router-dom"

export const RegionDetails = () => {
  const { id } = useParams()
  const { region, isLoading, isError, error } = useAdminRegion(id!)

  // TODO: Move to loading.tsx and set as Suspense fallback for the route
  if (isLoading) {
    return <div>Loading</div>
  }

  // TODO: Move to error.tsx and set as ErrorBoundary for the route
  if (isError || !region) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null
    return (
      <div>
        {(err as Error & { status: number })?.status === 404 ? (
          <div>Not found</div>
        ) : (
          <div>Something went wrong!</div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Container className="p-0">
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div>
            <Heading>{region.name}</Heading>
            <div className="text-ui-fg-subtle flex items-center gap-x-2">
              <Text leading="compact" size="small">
                {region.countries
                  .slice(0, 2)
                  .map((c) => c.display_name)
                  .join(", ")}
              </Text>
              {region.countries.length > 2 && (
                <Tooltip
                  content={
                    <ul>
                      {region.countries.slice(2).map((c) => (
                        <li key={c.id}>{c.display_name}</li>
                      ))}
                    </ul>
                  }
                >
                  <Text
                    leading="compact"
                    size="small"
                    weight="plus"
                    className="cursor-default"
                  >
                    + {region.countries.length - 2} more
                  </Text>
                </Tooltip>
              )}
            </div>
          </div>
          <IconButton variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </div>
        <div className="flex items-center justify-between border-b px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            Currency
          </Text>
        </div>
        <div className="flex items-center justify-between border-b px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            Default Tax Rate
          </Text>
        </div>
        <div className="flex items-center justify-between border-b px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            Default Tax Code
          </Text>
        </div>
        <div className="flex items-center justify-between border-b px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            Tax Inclusive Pricing
          </Text>
        </div>
        <div className="flex items-center justify-between border-b px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            Payment Providers
          </Text>
        </div>
        <div className="flex items-center justify-between px-8 py-6">
          <Text size="small" leading="compact" weight="plus">
            Fulfillment Providers
          </Text>
        </div>
      </Container>
      <Container></Container>
      <Container></Container>
    </div>
  )
}
