import { PlusMini } from "@medusajs/icons"
import { Copy, IconButton, Text } from "@medusajs/ui"

export default function CopyAsChild() {
  return (
    <div className="flex items-center gap-x-2">
      <Text>Copy command</Text>
      <Copy content="yarn add @medusajs/ui" asChild>
        <IconButton className="text-ui-fg-on-inverted">
          <PlusMini />
        </IconButton>
      </Copy>
    </div>
  )
}
