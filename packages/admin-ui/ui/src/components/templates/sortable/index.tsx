import {
  createContext,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  useContext,
  useState,
} from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  CollisionDetection,
  DragMoveEvent,
  Modifiers,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"
import { Arguments as UseSortableArguments } from "@dnd-kit/sortable/dist/hooks/useSortable"

export interface SortableItemType {
  id: UniqueIdentifier
}

export interface SortableProps<T extends SortableItemType = SortableItemType> {
  items: T[]
  onDragStart?: (event: DragStartEvent) => void
  onDragMove?: (event: DragMoveEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  onDragEnd?: (event: DragEndEvent) => void
  modifiers?: Modifiers
  collisionDetection?: CollisionDetection
  sortingStrategy?: SortingStrategy
  dragOverlayItem?: FC<{ item: any }>
}

export const Sortable: FC<PropsWithChildren<SortableProps>> = ({
  items,
  children,
  onDragStart,
  onDragMove,
  onDragOver,
  onDragEnd,
  modifiers = [restrictToFirstScrollableAncestor],
  collisionDetection = closestCenter,
  sortingStrategy = verticalListSortingStrategy,
  dragOverlayItem: DragOverlayItem,
}) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
    onDragStart?.(event)
  }

  const handleDragMove = (event: DragOverEvent) => {
    onDragMove?.(event)
  }

  const handleDragOver = (event: DragOverEvent) => {
    onDragOver?.(event)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    onDragEnd?.(event)
  }

  const activeItem = items.find((item) => item.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={sortingStrategy}>
        {children}
      </SortableContext>

      {!!DragOverlayItem && (
        <DragOverlay>
          {activeItem && <DragOverlayItem item={activeItem} />}
        </DragOverlay>
      )}
    </DndContext>
  )
}

export const SortableItemContext = createContext<SortableItemType>(
  undefined as any
)

export const useSortableItem = (options?: Omit<UseSortableArguments, "id">) => {
  const { id } = useContext(SortableItemContext)
  const sortable = useSortable({ ...options, id })

  return { ...sortable, id }
}

export interface SortableItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "id" | "className"> {
  id: string | number
  handle?: boolean
  as?: "div" | "span" | "li" | "tr" | "section" | "article" | FC
  className?: string | ((props: { isDragging: boolean }) => string)
}

export const SortableItem: FC<PropsWithChildren<SortableItemProps>> = ({
  id,
  handle,
  as: T = "div",
  className,
  ...props
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  }

  const computedClassName =
    typeof className === "function" ? className?.({ isDragging }) : className

  return (
    <SortableItemContext.Provider value={{ id }}>
      <T
        ref={setNodeRef}
        style={style}
        className={computedClassName}
        {...attributes}
        {...(!handle ? listeners : undefined)}
        {...props}
      />
    </SortableItemContext.Provider>
  )
}

export const SortableItemHandle: FC<PropsWithChildren> = (props) => {
  const { setActivatorNodeRef, listeners } = useSortableItem()

  return <div ref={setActivatorNodeRef} {...listeners} {...props} />
}
