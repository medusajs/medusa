import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  DotsSix,
  StackPerspective,
  ThumbnailBadge,
  Trash,
  XMark,
} from "@medusajs/icons"
import { IconButton, Text } from "@medusajs/ui"
import { useState } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../../../components/common/action-menu"
import { formatFileSize } from "../../../../../../../lib/format-file-size"
import { UploadMediaFormItem } from "../../../../../common/components/upload-media-form-item"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateMediaSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
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

export const ProductCreateMediaSection = ({
  form,
}: ProductCreateMediaSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    name: "media",
    control: form.control,
    keyName: "field_id",
  })

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.field_id === active.id)
      const newIndex = fields.findIndex((item) => item.field_id === over?.id)

      form.setValue("media", arrayMove(fields, oldIndex, newIndex), {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const getOnDelete = (index: number) => {
    return () => {
      remove(index)
    }
  }

  const getMakeThumbnail = (index: number) => {
    return () => {
      const newFields = fields.map((field, i) => {
        return {
          ...field,
          isThumbnail: i === index,
        }
      })

      form.setValue("media", newFields, {
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }

  const getItemHandlers = (index: number) => {
    return {
      onDelete: getOnDelete(index),
      onMakeThumbnail: getMakeThumbnail(index),
    }
  }

  return (
    <div id="media" className="flex flex-col gap-y-2">
      <UploadMediaFormItem form={form} append={append} showHint={false} />
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
      >
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId ? (
            <MediaGridItemOverlay
              field={fields.find((m) => m.field_id === activeId)!}
            />
          ) : null}
        </DragOverlay>
        <ul className="flex flex-col gap-y-2">
          <SortableContext items={fields.map((field) => field.field_id)}>
            {fields.map((field, index) => {
              const { onDelete, onMakeThumbnail } = getItemHandlers(index)

              return (
                <MediaItem
                  key={field.field_id}
                  field={field}
                  onDelete={onDelete}
                  onMakeThumbnail={onMakeThumbnail}
                />
              )
            })}
          </SortableContext>
        </ul>
      </DndContext>
    </div>
  )
}

type MediaField = {
  isThumbnail: boolean
  url: string
  id?: string | undefined
  file?: File
  field_id: string
}

type MediaItemProps = {
  field: MediaField
  onDelete: () => void
  onMakeThumbnail: () => void
}

const MediaItem = ({ field, onDelete, onMakeThumbnail }: MediaItemProps) => {
  const { t } = useTranslation()

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.field_id })

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  }

  if (!field.file) {
    return null
  }

  return (
    <li
      className="bg-ui-bg-component shadow-elevation-card-rest flex items-center justify-between rounded-lg px-3 py-2"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center gap-x-2">
        <IconButton
          variant="transparent"
          type="button"
          size="small"
          {...attributes}
          {...listeners}
          ref={setActivatorNodeRef}
          className="cursor-grab touch-none active:cursor-grabbing"
        >
          <DotsSix className="text-ui-fg-muted" />
        </IconButton>
        <div className="flex items-center gap-x-3">
          <div className="bg-ui-bg-base h-10 w-[30px] overflow-hidden rounded-md">
            <ThumbnailPreview url={field.url} />
          </div>
          <div className="flex flex-col">
            <Text size="small" leading="compact">
              {field.file.name}
            </Text>
            <div className="flex items-center gap-x-1">
              {field.isThumbnail && <ThumbnailBadge />}
              <Text
                size="xsmall"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                {formatFileSize(field.file.size)}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("products.media.makeThumbnail"),
                  icon: <StackPerspective />,
                  onClick: onMakeThumbnail,
                },
              ],
            },
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("actions.delete"),
                  onClick: onDelete,
                },
              ],
            },
          ]}
        />
        <IconButton
          type="button"
          size="small"
          variant="transparent"
          onClick={onDelete}
        >
          <XMark />
        </IconButton>
      </div>
    </li>
  )
}

const MediaGridItemOverlay = ({ field }: { field: MediaField }) => {
  return (
    <li className="bg-ui-bg-component shadow-elevation-card-rest flex items-center justify-between rounded-lg px-3 py-2">
      <div className="flex items-center gap-x-2">
        <IconButton
          variant="transparent"
          size="small"
          className="cursor-grab touch-none active:cursor-grabbing"
        >
          <DotsSix className="text-ui-fg-muted" />
        </IconButton>
        <div className="flex items-center gap-x-3">
          <div className="bg-ui-bg-base h-10 w-[30px] overflow-hidden rounded-md">
            <ThumbnailPreview url={field.url} />
          </div>
          <div className="flex flex-col">
            <Text size="small" leading="compact">
              {field.file?.name}
            </Text>
            <div className="flex items-center gap-x-1">
              {field.isThumbnail && <ThumbnailBadge />}
              <Text
                size="xsmall"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                {formatFileSize(field.file?.size ?? 0)}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <ActionMenu groups={[]} />
        <IconButton
          type="button"
          size="small"
          variant="transparent"
          onClick={() => {}}
        >
          <XMark />
        </IconButton>
      </div>
    </li>
  )
}

const ThumbnailPreview = ({ url }: { url?: string | null }) => {
  if (!url) {
    return null
  }

  return (
    <img src={url} alt="" className="size-full object-cover object-center" />
  )
}
