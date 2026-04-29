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
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { zodResolver } from "@hookform/resolvers/zod"
import { ThumbnailBadge } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Checkbox, clx, CommandBar, toast, Tooltip } from "@medusajs/ui"
import { Fragment, useCallback, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "@medusajs/framework/zod"
import { KeyboundForm } from "../../../../../../../components/keybound-form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../../../components/modals"
import { UploadMediaFormItem } from "../../../../../../../components/upload-media-form-item"
import { useUpdateProduct } from "../../../../../../../hooks/api/products"
import { sdk } from "../../../../../../../lib/sdk"
import {
  EditProductMediaSchema,
  MediaSchema,
} from "../../../../components/gift-card-product-create-form/schema"
import { EditProductMediaSchemaType } from "../../../../components/gift-card-product-create-form/types"

type ProductMediaViewProps = {
  product: HttpTypes.AdminProduct
}

type Media = z.infer<typeof MediaSchema>

export const EditProductMediaForm = ({ product }: ProductMediaViewProps) => {
  const [selection, setSelection] = useState<Record<string, true>>({})
  const { handleSuccess } = useRouteModal()

  const form = useForm<EditProductMediaSchemaType>({
    defaultValues: {
      media: getDefaultValues(product.images, product.thumbnail),
    },
    resolver: zodResolver(EditProductMediaSchema),
  })

  const { fields, append, remove, update } = useFieldArray({
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

  const { mutateAsync, isPending } = useUpdateProduct(product.id!)

  const handleSubmit = form.handleSubmit(async ({ media }) => {
    const filesToUpload = media
      .map((m, i) => ({ file: m.file, index: i }))
      .filter((m) => !!m.file)

    let uploaded: HttpTypes.AdminFile[] = []

    if (filesToUpload.length) {
      const { files: uploads } = await sdk.admin.upload
        .create({ files: filesToUpload.map((m) => m.file) })
        .catch(() => {
          form.setError("media", {
            type: "invalid_file",
            message: "Failed to upload media",
          })
          return { files: [] }
        })
      uploaded = uploads
    }

    const withUpdatedUrls = media.map((entry, i) => {
      const toUploadIndex = filesToUpload.findIndex((m) => m.index === i)
      if (toUploadIndex > -1) {
        return { ...entry, url: uploaded[toUploadIndex]?.url }
      }
      return entry
    })
    const thumbnail = withUpdatedUrls.find((m) => m.isThumbnail)?.url

    await mutateAsync(
      {
        images: withUpdatedUrls.map((file) => ({ url: file.url, id: file.id })),
        thumbnail: thumbnail || null,
      },
      {
        onSuccess: () => {
          toast.success("Product media updated")
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const handleCheckedChange = useCallback(
    (id: string) => {
      return (val: boolean) => {
        if (!val) {
          const { [id]: _, ...rest } = selection
          setSelection(rest)
        } else {
          setSelection((prev) => ({ ...prev, [id]: true }))
        }
      }
    },
    [selection]
  )

  const handleDelete = () => {
    const ids = Object.keys(selection)
    const indices = ids.map((id) => fields.findIndex((m) => m.id === id))

    remove(indices)
    setSelection({})
  }

  const handlePromoteToThumbnail = () => {
    const ids = Object.keys(selection)

    if (!ids.length) {
      return
    }

    const currentThumbnailIndex = fields.findIndex((m) => m.isThumbnail)

    if (currentThumbnailIndex > -1) {
      update(currentThumbnailIndex, {
        ...fields[currentThumbnailIndex],
        isThumbnail: false,
      })
    }

    const index = fields.findIndex((m) => m.id === ids[0])

    update(index, {
      ...fields[index],
      isThumbnail: true,
    })

    setSelection({})
  }

  const selectionCount = Object.keys(selection).length

  return (
    <RouteFocusModal.Form blockSearchParams form={form}>
      <KeyboundForm
        className="flex size-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary" size="small" asChild>
              <Link to={{ pathname: ".", search: undefined }}>Gallery</Link>
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <div className="flex size-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
            >
              <div className="bg-ui-bg-subtle size-full overflow-auto">
                <div className="grid h-fit auto-rows-auto grid-cols-4 gap-6 p-6">
                  <SortableContext
                    items={fields.map((m) => m.field_id)}
                    strategy={rectSortingStrategy}
                  >
                    {fields.map((m) => {
                      return (
                        <MediaGridItem
                          onCheckedChange={handleCheckedChange(m.id!)}
                          checked={!!selection[m.id!]}
                          key={m.field_id}
                          media={m}
                        />
                      )
                    })}
                  </SortableContext>
                  <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeId ? (
                      <MediaGridItemOverlay
                        media={fields.find((m) => m.field_id === activeId)!}
                        checked={
                          !!selection[
                            fields.find((m) => m.field_id === activeId)!.id!
                          ]
                        }
                      />
                    ) : null}
                  </DragOverlay>
                </div>
              </div>
            </DndContext>
            <div className="bg-ui-bg-base overflow-auto border-b px-6 py-4 lg:border-b-0 lg:border-l">
              <UploadMediaFormItem form={form} append={append} />
            </div>
          </div>
        </RouteFocusModal.Body>
        <CommandBar open={!!selectionCount}>
          <CommandBar.Bar>
            <CommandBar.Value>{selectionCount} selected</CommandBar.Value>
            <CommandBar.Seperator />
            {selectionCount === 1 && (
              <Fragment>
                <CommandBar.Command
                  action={handlePromoteToThumbnail}
                  label="Make thumbnail"
                  shortcut="t"
                />
                <CommandBar.Seperator />
              </Fragment>
            )}
            <CommandBar.Command
              action={handleDelete}
              label="Delete"
              shortcut="d"
            />
          </CommandBar.Bar>
        </CommandBar>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              Save
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

const getDefaultValues = (
  images: HttpTypes.AdminProductImage[] | null | undefined,
  thumbnail: string | null | undefined
) => {
  const media: Media[] =
    images?.map((image) => ({
      id: image.id!,
      url: image.url!,
      isThumbnail: image.url === thumbnail,
      file: null,
    })) || []

  if (thumbnail && !media.some((mediaItem) => mediaItem.url === thumbnail)) {
    const id = Math.random().toString(36).substring(7)

    media.unshift({
      id: id,
      url: thumbnail,
      isThumbnail: true,
      file: null,
    })
  }

  return media
}

interface MediaView {
  id?: string
  field_id: string
  url: string
  isThumbnail: boolean
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

interface MediaGridItemProps {
  media: MediaView
  checked: boolean
  onCheckedChange: (value: boolean) => void
}

const MediaGridItem = ({
  media,
  checked,
  onCheckedChange,
}: MediaGridItemProps) => {
  const handleToggle = useCallback(
    (value: boolean) => {
      onCheckedChange(value)
    },
    [onCheckedChange]
  )

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.field_id })

  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      className={clx(
        "shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full overflow-hidden rounded-lg outline-none"
      )}
      style={style}
      ref={setNodeRef}
    >
      {media.isThumbnail && (
        <div className="absolute left-2 top-2">
          <Tooltip content="Thumbnail">
            <ThumbnailBadge />
          </Tooltip>
        </div>
      )}
      <div
        className={clx("absolute inset-0 cursor-grab touch-none outline-none", {
          "cursor-grabbing": isDragging,
        })}
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
      />
      <div
        className={clx("transition-fg absolute right-2 top-2 opacity-0", {
          "group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100":
            !isDragging && !checked,
          "opacity-100": checked,
        })}
      >
        <Checkbox
          onClick={(e) => {
            e.stopPropagation()
          }}
          checked={checked}
          onCheckedChange={handleToggle}
        />
      </div>
      <img
        src={media.url}
        alt=""
        className="size-full object-cover object-center"
      />
    </div>
  )
}

export const MediaGridItemOverlay = ({
  media,
  checked,
}: {
  media: MediaView
  checked: boolean
}) => {
  return (
    <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover focus-visible:shadow-borders-focus bg-ui-bg-subtle-hover group relative aspect-square h-auto max-w-full cursor-grabbing overflow-hidden rounded-lg outline-none">
      {media.isThumbnail && (
        <div className="absolute left-2 top-2">
          <ThumbnailBadge />
        </div>
      )}
      <div
        className={clx("transition-fg absolute right-2 top-2 opacity-0", {
          "opacity-100": checked,
        })}
      >
        <Checkbox checked={checked} />
      </div>
      <img
        src={media.url}
        alt=""
        className="size-full object-cover object-center"
      />
    </div>
  )
}
