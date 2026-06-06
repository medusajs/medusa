import { ArrowUpRightOnBox } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import { Badge, Container, Heading, IconButton } from "@zjedene-medusa/ui"
import { Link } from "react-router-dom"

interface MetadataSectionProps {
  order: HttpTypes.AdminOrder
}

export const MetadataSection = ({ order }: MetadataSectionProps) => {
  return (
    <Container className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <Heading level="h2">Metadata</Heading>
        <Badge size="2xsmall" rounded="full">
          {Object.keys(order.metadata || {}).length} keys
        </Badge>
      </div>
      <IconButton
        variant="transparent"
        size="small"
        className="text-ui-fg-muted hover:text-ui-fg-subtle"
        asChild
      >
        <Link to="metadata">
          <ArrowUpRightOnBox />
        </Link>
      </IconButton>
    </Container>
  )
}
