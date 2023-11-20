import React from "react"
import { OrderPlacedEvent } from "../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../utils/prices"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import EventContainer from "./event-container"
import { useTranslation } from "react-i18next"

type OrderPlacedProps = {
  event: OrderPlacedEvent
}

const OrderPlaced: React.FC<OrderPlacedProps> = ({ event }) => {
  const { t } = useTranslation()
  const args = {
    icon: <CheckCircleIcon size={20} />,
    time: event.time,
    title: t("Order Placed"),
    midNode: (
      <div className="inter-small-regular text-grey-50">
        {formatAmountWithSymbol({
          amount: event.amount,
          currency: event.currency_code,
        })}
      </div>
    ),
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default OrderPlaced
