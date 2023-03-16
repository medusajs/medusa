import React from "react"

type EventItemContainerProps = {
  item: {
    thumbnail?: string
    title: string
    quantity: number
    variant: {
      title: string
    }
  }
  detail?: string
}

const EventItemContainer: React.FC<EventItemContainerProps> = ({
  item,
  detail,
}) => {
  if (!item) {
    return null
  }

  return (
    <div className="mb-base flex flex-col last:mb-0 ">
      <div className="gap-x-small flex items-center">
        {item.thumbnail && (
          <div className="rounded-base h-10 w-[30px] overflow-hidden">
            <img
              src={item.thumbnail}
              alt={`Thumbnail for ${item.title}`}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="inter-small-regular flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <p>{item.title}</p>
            <span className="inter-small-semibold text-violet-60">{`x${item.quantity}`}</span>
          </div>
          <p className="text-grey-50">{item.variant.title}</p>
        </div>
      </div>
      {detail && <div className="text-grey-50">{detail}</div>}
    </div>
  )
}

export default EventItemContainer
