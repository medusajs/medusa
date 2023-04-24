import {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  MouseEvent,
  useState,
} from "react"
import { PostSection } from "@medusajs/medusa"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"
import Button from "../../../../../../components/fundamentals/button"
import GripIcon from "../../../../../../components/fundamentals/icons/grip-icon"
import Badge from "../../../../../../components/fundamentals/badge"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "../../../../../../components/templates/sortable"
import { getSectionTypeLabel } from "../helpers/get-section-type-label"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import CrossIcon from "../../../../../../components/fundamentals/icons/cross-icon"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import { PostSectionDeleteButton } from "./post-section-details/post-section-delete-button"
import PublishIcon from "../../../../../../components/fundamentals/icons/publish-icon"
import {
  useAdminDuplicatePostSection,
  useAdminUpdatePostSection,
} from "../../../../../../hooks/admin/post-sections"
import { PostSectionStatus } from "../../../../../../types/shared"
import UnpublishIcon from "../../../../../../components/fundamentals/icons/unpublish-icon"
import DuplicateIcon from "../../../../../../components/fundamentals/icons/duplicate-icon"
import Tooltip from "../../../../../../components/atoms/tooltip"
import LibraryIcon from "../../../../../../components/fundamentals/icons/library"
import LibraryAddIcon from "../../../../../../components/fundamentals/icons/library-add"
import { usePostContext } from "../../../../context"
import { updateLivePreviewPostData } from "../../../../helpers/update-live-preview-post-data"

export type PostSectionListProps = HTMLAttributes<HTMLDivElement> & {
  items: { id: string; value: string }[]
  sections?: PostSection[]
  onSortItem: ({
    oldIndex,
    newIndex,
    sortedItems,
  }: {
    oldIndex: number
    newIndex: number
    sortedItems: { id: string; value: string }[]
  }) => void
  onEditItemClick: (id: string) => void
  onAddToLibraryItem?: (postSection: PostSection) => void
  onDuplicateItem: (id: string, newPostSection: PostSection) => void
  onPublishItem?: (postSection: PostSection) => void
  onUnpublishItem?: (postSection: PostSection) => void
  onRemoveItemClick: (index: number) => void
  onDeleteItem: (postSection: PostSection) => void
}

export interface PostSectionListItemProps {
  index: number
  section: PostSection
  onEditClick: (id: string) => void
  onAddToLibrary?: (postSection: PostSection) => void
  onDuplicate: (id: string, newPostSection: PostSection) => void
  onPublish?: (postSection: PostSection) => void
  onUnpublish?: (postSection: PostSection) => void
  onRemoveClick: (index: number) => void
  onDelete: (postSection: PostSection) => void
}

export const PostSectionListItem: FC<PostSectionListItemProps> = ({
  index,
  section,
  onEditClick,
  onAddToLibrary,
  onDuplicate,
  onPublish,
  onUnpublish,
  onRemoveClick,
  onDelete,
}) => {
  const { post, featureFlags } = usePostContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { mutateAsync: updatePostSection } = useAdminUpdatePostSection(
    section.id
  )
  const { mutateAsync: duplicatePostSection } = useAdminDuplicatePostSection(
    section.id
  )
  const usageCount = section.usage_count || 1

  const handleEditClick = () => {
    onEditClick(section.id)
    setIsMenuOpen(false)
  }

  const handleAddToLibraryClick = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation()
    await updatePostSection({
      type: section.type,
      is_reusable: true,
    })
    setIsMenuOpen(false)
    if (onAddToLibrary) onAddToLibrary(section)
  }

  const handleDuplicateClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const {
      data: { post_section },
    } = await duplicatePostSection({ type: section.type })
    setIsMenuOpen(false)
    if (onDuplicate) onDuplicate(section.id, post_section)
  }

  const handlePublishClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    updateLivePreviewPostData({
      post,
      sections: [{ ...section, status: PostSectionStatus.PUBLISHED }],
    })
    await updatePostSection({
      type: section.type,
      status: PostSectionStatus.PUBLISHED,
    })
    setIsMenuOpen(false)
    if (onPublish) onPublish(section)
  }

  const handleUnpublishClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    updateLivePreviewPostData({
      post,
      sections: [{ ...section, status: PostSectionStatus.DRAFT }],
    })
    await updatePostSection({
      type: section.type,
      status: PostSectionStatus.DRAFT,
    })
    setIsMenuOpen(false)
    if (onUnpublish) onUnpublish(section)
  }

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onRemoveClick(index)
    updateLivePreviewPostData({
      post,
      sectionIndex: index,
    })
    setIsMenuOpen(false)
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const toggleIsMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <article
      className={clsx(
        `p-3 flex items-center justify-between leading-none text-left bg-white border border-grey-20 rounded-rounded hover:bg-grey-5 focus:border-violet-60 focus:text-violet-60 focus:outline-none focus:shadow-cta`,
        {
          "!pointer-events-none !cursor-not-allowed !bg-grey-5":
            featureFlags.sections === "readonly",
        }
      )}
      onClick={handleEditClick}
      tabIndex={0}
      role="button"
    >
      <div className="flex flex-1 min-w-0 items-center gap-1.5">
        <div className="grow-0 shrink-0">
          <SortableItemHandle>
            <Button
              variant="ghost"
              size="small"
              className="h-6 w-6 cursor-grab active:cursor-grabbing text-grey-50 p-0"
            >
              <GripIcon className="w-5 h-5" />
            </Button>
          </SortableItemHandle>
        </div>

        <div className="flex-1 min-w-0 max-w-[calc(100%-40px)]">
          <div className="inter-xsmall-regular text-grey-50">
            {getSectionTypeLabel(section.type)}
          </div>
          <h3 className="inter-base-semibold w-full truncate -mt-1">
            {section.name || "Untitled"}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-1.5 grow-0 shrink-0">
        {section.is_reusable && (
          <Tooltip
            sideOffset={4}
            className="z-50 !max-w-[160px]"
            content={
              <>
                This library section is used in{" "}
                <span className="font-semibold">{usageCount}</span>
                &nbsp;location
                {usageCount > 1 ? "s" : ""}.
              </>
            }
          >
            <Badge
              variant="primary"
              size="small"
              className="flex items-center justify-center w-7 h-7"
            >
              <span>
                <LibraryIcon className="w-4 h-4" />
              </span>
            </Badge>
          </Tooltip>
        )}

        {section.status === PostSectionStatus.DRAFT && (
          <Badge variant="warning">Draft</Badge>
        )}

        <DropdownMenu.Root
          open={isMenuOpen}
          onOpenChange={(open) => setIsMenuOpen(open)}
        >
          <DropdownMenu.Trigger asChild>
            <Button
              variant="ghost"
              size="small"
              className="h-6 w-6 text-grey-50 p-0"
              onClick={toggleIsMenuOpen}
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="border bg-grey-0 border-grey-20 py-2 rounded-rounded shadow-dropdown min-w-[160px] z-30"
          >
            <DropdownMenu.Item>
              <Button
                variant="ghost"
                size="small"
                className="w-full justify-start rounded-none px-4"
                onClick={handleEditClick}
              >
                <EditIcon className="w-4 h-4" /> Edit
              </Button>
            </DropdownMenu.Item>

            {section.status === PostSectionStatus.PUBLISHED && (
              <DropdownMenu.Item>
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full justify-start rounded-none px-4"
                  onClick={handleUnpublishClick}
                >
                  <UnpublishIcon className="w-4 h-4" /> Unpublish
                </Button>
              </DropdownMenu.Item>
            )}

            {section.status === PostSectionStatus.DRAFT && (
              <DropdownMenu.Item>
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full justify-start rounded-none px-4"
                  onClick={handlePublishClick}
                >
                  <PublishIcon className="w-4 h-4" /> Publish
                </Button>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item>
              <Button
                variant="ghost"
                size="small"
                className="w-full justify-start rounded-none px-4"
                onClick={handleDuplicateClick}
              >
                <DuplicateIcon className="w-4 h-4" /> Duplicate
              </Button>
            </DropdownMenu.Item>

            {!section.is_reusable && (
              <DropdownMenu.Item>
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full justify-start rounded-none px-4"
                  onClick={handleAddToLibraryClick}
                >
                  <LibraryAddIcon className="w-4 h-4" /> Add to library
                </Button>
              </DropdownMenu.Item>
            )}

            {section.is_reusable && (
              <DropdownMenu.Item>
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full justify-start rounded-none px-4"
                  onClick={handleRemoveClick}
                >
                  <CrossIcon className="w-4 h-4" /> Remove
                </Button>
              </DropdownMenu.Item>
            )}

            <DropdownMenu.Item>
              <PostSectionDeleteButton
                postSection={section}
                size="small"
                className="!w-full justify-start rounded-none !border-none px-4"
                onClick={handleDeleteClick}
                onDelete={onDelete}
                onCancel={() => setIsMenuOpen(false)}
              >
                <TrashIcon className="w-4 h-4" /> Delete
              </PostSectionDeleteButton>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </article>
  )
}

export const PostSectionList: FC<PropsWithChildren<PostSectionListProps>> = ({
  items,
  sections,
  className,
  onSortItem,
  onEditItemClick,
  onAddToLibraryItem,
  onDuplicateItem,
  onPublishItem,
  onUnpublishItem,
  onRemoveItemClick,
  onDeleteItem,
  ...props
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over?.id) return
    if (active.id === over.id) return

    const oldIndex = items.findIndex((f) => f.id === active.id)
    const newIndex = items.findIndex((f) => f.id === over?.id)
    const sortedItems = arrayMove(items, oldIndex, newIndex)

    onSortItem?.({ oldIndex, newIndex, sortedItems })
  }

  if (!sections?.length) return null

  return (
    <Sortable items={items} onDragEnd={handleDragEnd}>
      <div className={clsx("flex flex-col gap-2", className)} {...props}>
        {items.map((item, index) => {
          const section = sections.find((s) => s.id === item.value)

          if (!section) return null

          return (
            <SortableItem
              id={item.id}
              key={item.id}
              handle
              role="listitem"
              tabIndex={-1}
            >
              <PostSectionListItem
                index={index}
                section={section}
                onEditClick={onEditItemClick}
                onAddToLibrary={onAddToLibraryItem}
                onDuplicate={onDuplicateItem}
                onPublish={onPublishItem}
                onUnpublish={onUnpublishItem}
                onRemoveClick={onRemoveItemClick}
                onDelete={onDeleteItem}
              />
            </SortableItem>
          )
        })}
      </div>
    </Sortable>
  )
}
