import { FC, MouseEvent } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useFormContext } from "react-hook-form"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import { usePostSectionContext } from "./context/post-section-context"
import Button from "../../../../../../../components/fundamentals/button"
import TrashIcon from "../../../../../../../components/fundamentals/icons/trash-icon"
import { PostSectionDeleteButton } from "./post-section-delete-button"
import DuplicateIcon from "../../../../../../../components/fundamentals/icons/duplicate-icon"
import { PostSectionDuplicateButton } from "./post-section-duplicate-button"
import LibraryAddIcon from "../../../../../../../components/fundamentals/icons/library-add"
import UnpublishIcon from "../../../../../../../components/fundamentals/icons/unpublish-icon"
import PublishIcon from "../../../../../../../components/fundamentals/icons/publish-icon"
import { PostSectionStatus } from "../../../../../../../types/shared"

export const PostSectionOptionsMenu: FC = () => {
  const { postSection, onSave, onDuplicate, onDelete, isDraft, isPublished } =
    usePostSectionContext()
  const { setValue } = useFormContext()

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleAddToLibraryClick = () => {
    setValue("is_reusable", true)
    onSave()
  }

  const handlePublishClick = async () => {
    setValue("status", PostSectionStatus.PUBLISHED)
    onSave()
  }

  const handleUnpublishClick = async () => {
    setValue("status", PostSectionStatus.DRAFT)
    onSave()
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="small" className="w-8 h-8 p-0">
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={4}
        className="border bg-grey-0 border-grey-20 py-2 rounded-rounded shadow-dropdown min-w-[160px] z-30"
      >
        {isPublished && (
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

        {isDraft && (
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
          <PostSectionDuplicateButton
            postSection={postSection}
            className="w-full justify-start rounded-none px-4"
            onDuplicate={onDuplicate}
          >
            <DuplicateIcon className="w-4 h-4" /> Duplicate
          </PostSectionDuplicateButton>
        </DropdownMenu.Item>

        {!postSection.is_reusable && (
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

        <DropdownMenu.Item>
          <PostSectionDeleteButton
            postSection={postSection}
            size="small"
            className="!w-full justify-start rounded-none !border-none px-4"
            onClick={handleDeleteClick}
            onDelete={onDelete}
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </PostSectionDeleteButton>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
