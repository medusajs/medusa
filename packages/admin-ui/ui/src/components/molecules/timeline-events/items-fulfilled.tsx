import React from "react"
import { ItemsFulfilledEvent } from "../../../hooks/use-build-timeline"
import PackageIcon from "../../fundamentals/icons/package-icon"
import EventContainer from "./event-container"
import EventItemContainer from "./event-item-container"

type ItemsFulfilledProps = {
  event: ItemsFulfilledEvent
}

const ItemsFulfilled: React.FC<ItemsFulfilledProps> = ({ event }) => {
  const title =
    event.sourceType === "claim"
      ? "Replacement Items Fulfilled"
      : event.sourceType === "exchange"
      ? "Exchange Items Fulfilled"
      : "Items Fulfilled"

  const args = {
    icon: <PackageIcon size={20} />,
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

export default ItemsFulfilled
