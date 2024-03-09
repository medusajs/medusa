import { Button, Container, Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"

export const TaxListCallout = () => {
  return (
    <Container className="flex items-center justify-between gap-x-3 px-6 py-4">
      <div>
        <Heading>Taxes</Heading>
        <Text size="small" className="text-ui-fg-subtle text-pretty">
          Tax settings are specific to each region. To modify tax settings,
          please select a region from the list.
        </Text>
      </div>
      <Button
        size="small"
        variant="secondary"
        asChild
        className="shrink-0 whitespace-nowrap"
      >
        <Link to="/settings/regions">Go to Region settings</Link>
      </Button>
    </Container>
  )
}
