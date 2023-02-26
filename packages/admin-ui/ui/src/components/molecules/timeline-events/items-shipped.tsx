import React from "react"
import { ItemsShippedEvent } from "../../../hooks/use-build-timeline"
import TruckIcon from "../../fundamentals/icons/truck-icon"
import EventContainer from "./event-container"
import EventItemContainer from "./event-item-container"

type ItemsShippedProps = {
  event: ItemsShippedEvent
}

const ItemsShipped: React.FC<ItemsShippedProps> = ({ event }) => {
  const title =
    event.sourceType === "claim"
      ? "Replacement Items Shipped"
      : event.sourceType === "exchange"
      ? "Exchange Items Shipped"
      : "Items Shipped"

  const args = {
    icon: <TruckIcon size={20} />,
    time: event.time,
    title: title,
    children: event.items.map((item, index) => (
      <EventItemContainer item={item} key={index} />
    )),
    noNotification: event.noNotification,
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default ItemsShipped
