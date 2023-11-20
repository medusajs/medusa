import { useAdminUser } from "medusa-react"
import React from "react"
import { ByLine } from "."
import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import XCircleIcon from "../../../fundamentals/icons/x-circle-icon"
import EventContainer from "../event-container"
import { useTranslation } from "react-i18next"

type EditCanceledProps = {
  event: OrderEditEvent
}

const EditCanceled: React.FC<EditCanceledProps> = ({ event }) => {
  const { user } = useAdminUser(event.edit.canceled_by as string)
  const {t} = useTranslation()
  return (
    <EventContainer
      title={t("Order Edit canceled")}
      icon={<XCircleIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={<ByLine user={user} />}
    />
  )
}

export default EditCanceled
