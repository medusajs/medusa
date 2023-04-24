import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PostSection } from "@medusajs/medusa"
import clsx from "clsx"
import { PlusIcon } from "@heroicons/react/24/solid"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { getSectionTypeOptions } from "../helpers/get-section-type-options"
import { usePostContext } from "../../../../context"
import { usePostSectionsEditorContext } from "../context"
import { PostSectionType } from "../../../../../../types/shared"
import { PostSectionList } from "../components/post-section-list"
import ChevronDownIcon from "../../../../../../components/fundamentals/icons/chevron-down"
import Button from "../../../../../../components/fundamentals/button"
import LibraryIcon from "../../../../../../components/fundamentals/icons/library"
import { PostSectionLibraryModal } from "../components/post-section-library-modal"
import { PostTitle } from "../../post-title"
import { updateLivePreviewPostData } from "../../../../helpers/update-live-preview-post-data"
import { updateLivePreviewActiveSection } from "../../../../helpers/update-live-preview-active-section"

export const PostSectionsList = () => {
  const {
    sectionIds,
    postSections,
    onCreate,
    onDuplicate,
    onDelete,
    onSort,
    addItem,
    removeItem,
    isCreating,
    refetchPostSections,
  } = usePostSectionsEditorContext()
  const navigate = useNavigate()
  const { post, postTypeLabel, featureFlags } = usePostContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateSection = async (type: PostSectionType) => {
    if (onCreate) onCreate(type)
  }

  const handleDuplicateSection = (
    id,
    newPostSection: PostSection,
    shouldEdit?: boolean
  ) => {
    if (onDuplicate) onDuplicate(id, newPostSection, shouldEdit)
  }

  const handleDeleteSection = (postSection: PostSection) => {
    if (onDelete) onDelete(postSection)
  }

  const handleSortSections = (sortedItems: { id: string; value: string }[]) => {
    if (onSort) onSort(sortedItems)
  }

  const handleAddSectionsFromLibrary = (sections) => {
    if (!sections.length) return

    // NOTE: We need to manually update the live preview when a post section is created
    // so we can set it as active when we initially navigate to the edit view.
    updateLivePreviewPostData({ post: post, sections })

    // NOTE: We need to wait until the post section data has been pushed to the live preview,
    // or else the active section will not be properly highlighted in the live preview.
    setTimeout(() => {
      updateLivePreviewActiveSection(sections[0].id)
      addItem(sections.map((s) => ({ value: s.id })))
    })
  }

  const createSectionOptions = getSectionTypeOptions(featureFlags)

  return (
    <div className="flex flex-col p-5 large:p-6">
      <header className="flex flex-col gap-1 pt-2e">
        <div className="inter-small-regular text-grey-50 leading-none">
          {postTypeLabel} title
        </div>
        <PostTitle variant="advanced" />
      </header>

      <hr className="my-6" />

      {!!featureFlags.sections && (
        <div>
          <h3 className="inter-small-semibold text-grey-50 mb-xsmall">
            Sections
          </h3>
          <div className="flex flex-col gap-4">
            <PostSectionList
              items={sectionIds as any}
              sections={postSections}
              onSortItem={({ sortedItems }) => {
                handleSortSections(sortedItems)
              }}
              onEditItemClick={(id: string) => {
                navigate(`/admin/editor/${post.type}/${post.id}/sections/${id}`)
              }}
              onAddToLibraryItem={() => {
                refetchPostSections()
              }}
              onDuplicateItem={handleDuplicateSection}
              onPublishItem={() => {
                refetchPostSections()
              }}
              onUnpublishItem={() => {
                refetchPostSections()
              }}
              onRemoveItemClick={(index: number) => {
                removeItem(index)
              }}
              onDeleteItem={handleDeleteSection}
            />

            {featureFlags.sections && featureFlags.sections !== "readonly" && (
              <div className="sticky bottom-0 pb-6">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className={clsx(
                        "flex gap-2 items-center justify-center w-full select-none text-center inter-base-semibold text-grey-90 cursor-pointer rounded-rounded border-2 border-dashed border-grey-20 bg-white transition-colors hover:border-violet-60 hover:text-violet-60 focus:border-violet-60 focus:text-violet-60 focus:outline-none focus:shadow-cta py-3 px-2"
                      )}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <PlusIcon className="h-5 w-5" />
                          Add a section
                          <ChevronDownIcon className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content
                    sideOffset={-8}
                    className="z-30 border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown min-w-[200px] max-h-[40vh] overflow-y-auto"
                  >
                    <div className="flex flex-col gap-1 py-2">
                      <DropdownMenu.Item>
                        <Button
                          variant="ghost"
                          className="w-full !justify-start leading-4 rounded-none"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <LibraryIcon className="w-5 h-5 -ml-1 -mr-2" />{" "}
                          <span>Add from library</span>
                        </Button>
                      </DropdownMenu.Item>
                    </div>

                    <DropdownMenu.Separator className="border-t border-t-grey-20" />

                    <div className="flex flex-col py-2">
                      <h3 className="text-grey-50 inter-small-semibold mt-2 mb-2 px-6">
                        New Section
                      </h3>

                      {createSectionOptions.map((type, i) => (
                        <DropdownMenu.Item key={i}>
                          <Button
                            variant="ghost"
                            className="w-full !justify-start leading-4 rounded-none"
                            onClick={() => handleCreateSection(type.value)}
                          >
                            {type.label}
                          </Button>
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            )}
          </div>
        </div>
      )}

      {!!featureFlags.sections && isModalOpen && (
        <PostSectionLibraryModal
          open={isModalOpen}
          onSubmit={handleAddSectionsFromLibrary}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
