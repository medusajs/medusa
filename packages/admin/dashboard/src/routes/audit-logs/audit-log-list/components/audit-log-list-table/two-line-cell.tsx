import { Text } from "@medusajs/ui"

export const TwoLineCell = ({
  primary,
  secondary,
}: {
  primary: string
  secondary?: string | null
}) => (
  <div className="flex min-w-0 flex-col">
    <Text size="small" leading="compact" className="truncate">
      {primary}
    </Text>
    {secondary && (
      <Text
        size="xsmall"
        leading="compact"
        className="text-ui-fg-muted truncate"
      >
        {secondary}
      </Text>
    )}
  </div>
)
