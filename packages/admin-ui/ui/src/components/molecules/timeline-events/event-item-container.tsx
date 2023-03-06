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
}

const EventItemContainer: React.FC<EventItemContainerProps> = ({ item }) => {
  if (!item) {
    return null
  }
  return (
    <div className="flex items-center gap-x-small mb-base last:mb-0">
      {item.thumbnail && (
        <div className="h-10 w-[30px] rounded-base overflow-hidden">
          <img
            src={item.thumbnail}
            alt={`Thumbnail for ${item.title}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col inter-small-regular w-full">
        <div className="flex items-center justify-between w-full">
          <p>{item.title}</p>
          <span className="inter-small-semibold text-violet-60">{`x${item.quantity}`}</span>
        </div>
        <p className="text-grey-50">{item.variant.title}</p>
      </div>
    </div>
  )
}

export default EventItemContainer
