import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DropAnimation,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DotsSix } from "@medusajs/icons"
import { IconButton, clx } from "@medusajs/ui"
import {
  CSSProperties,
  Fragment,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react"

type SortableBaseItem = {
  id: UniqueIdentifier
}

interface SortableListProps<TItem extends SortableBaseItem> {
  items: TItem[]
  onChange: (items: TItem[]) => void
  renderItem: (item: TItem, index: number) => ReactNode
}

const List = <TItem extends SortableBaseItem>({
  items,
  onChange,
  renderItem,
}: SortableListProps<TItem>) => {
  const [active, setActive] = useState<Active | null>(null)

  const [activeItem, activeIndex] = useMemo(() => {
    if (active === null) {
      return [null, null]
    }

    const index = items.findIndex(({ id }) => id === active.id)

    return [items[index], index]
  }, [active, items])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActive(active)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = items.findIndex(({ id }) => id === active.id)
      const overIndex = items.findIndex(({ id }) => id === over.id)

      onChange(arrayMove(items, activeIndex, overIndex))
    }

    setActive(null)
  }

  const handleDragCancel = () => {
    setActive(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Overlay>
        {activeItem && activeIndex !== null
          ? renderItem(activeItem, activeIndex)
          : null}
      </Overlay>
      <SortableContext items={items}>
        <ul
          role="application"
          className="flex list-inside list-none list-image-none flex-col p-0"
        >
          {items.map((item, index) => (
            <Fragment key={item.id}>{renderItem(item, index)}</Fragment>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
}

type SortableOverlayProps = PropsWithChildren

const Overlay = ({ children }: SortableOverlayProps) => {
  return (
    <DragOverlay
      className="shadow-elevation-card-hover overflow-hidden rounded-md [&>li]:border-b-0"
      dropAnimation={dropAnimationConfig}
    >
      {children}
    </DragOverlay>
  )
}

type SortableItemProps<TItem extends SortableBaseItem> = PropsWithChildren<{
  id: TItem["id"]
  className?: string
}>

type SortableItemContextValue = {
  attributes: Record<string, any>
  listeners: DraggableSyntheticListeners
  ref: (node: HTMLElement | null) => void
  isDragging: boolean
}

const SortableItemContext = createContext<SortableItemContextValue | null>(null)

const useSortableItemContext = () => {
  const context = useContext(SortableItemContext)

  if (!context) {
    throw new Error(
      "useSortableItemContext must be used within a SortableItemContext"
    )
  }

  return context
}

const Item = <TItem extends SortableBaseItem>({
  id,
  className,
  children,
}: SortableItemProps<TItem>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
      isDragging,
    }),
    [attributes, listeners, setActivatorNodeRef, isDragging]
  )

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <SortableItemContext.Provider value={context}>
      <li
        className={clx("transition-fg flex flex-1 list-none", className)}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </li>
    </SortableItemContext.Provider>
  )
}

const DragHandle = () => {
  const { attributes, listeners, ref } = useSortableItemContext()

  return (
    <IconButton
      variant="transparent"
      size="small"
      {...attributes}
      {...listeners}
      ref={ref}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      <DotsSix className="text-ui-fg-muted" />
    </IconButton>
  )
}

export const SortableList = Object.assign(List, {
  Item,
  DragHandle,
})
