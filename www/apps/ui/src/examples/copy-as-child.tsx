import { PlusMini } from "@medusajs/icons"
import { Button, Copy, Text } from "@medusajs/ui"

export default function CopyAsChild() {
  return (
    <div className="flex items-center gap-x-2">
      <Text>Copy command</Text>
      <Copy content="yarn add @medusajs/ui" asChild>
        <Button format="icon" size="small" className="text-ui-fg-on-inverted">
          <PlusMini />
        </Button>
      </Copy>
    </div>
  )
}
