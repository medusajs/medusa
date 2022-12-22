import { sortBy } from "lodash"

import { SalesChannel } from "@medusajs/medusa"

/**
 * Customers Associated Groups props
 */
interface P {
  channels: SalesChannel[]
  showCount: number
}

/*
 * Render a summary of groups to which the customer belongs
 */
function SalesChannelsSummary(props: P) {
  const channels = sortBy(props.channels, "name")
  if (!channels.length) {
    return null
  }

  const allGroups = channels.map((g) => g.name).join(", ")

  const leadName = channels
    .slice(0, props.showCount)
    .map((g) => g.name)
    .join(", ")

  const left = channels.length - props.showCount

  return (
    <div title={allGroups} className="text-small">
      <span>{leadName}</span>
      {left > 0 && <span className="text-grey-50"> + {left} more</span>}
    </div>
  )
}

export default SalesChannelsSummary
