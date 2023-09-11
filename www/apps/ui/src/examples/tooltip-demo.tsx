import { InformationCircleSolid } from "@medusajs/icons"
import { Tooltip } from "@medusajs/ui"

export default function TooltipDemo() {
  return (
    <Tooltip content="The quick brown fox jumps over the lazy dog.">
      <InformationCircleSolid />
    </Tooltip>
  )
}
