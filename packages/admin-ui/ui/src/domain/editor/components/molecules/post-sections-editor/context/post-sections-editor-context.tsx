import { PostSection } from "@medusajs/medusa"
import { createContext, useContext, useMemo } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {
  useAdminCreatePostSection,
  useGetPostSections,
} from "../../../../../../hooks/admin/post-sections"
import {
  PostSectionStatus,
  PostSectionType,
} from "../../../../../../types/shared"
import { usePostContext } from "../../../../context"
import { updateLivePreviewActiveSection } from "../../../../helpers/update-live-preview-active-section"
import { updateLivePreviewPostData } from "../../../../helpers/update-live-preview-post-data"
import { useUpdatePostDraft } from "../../../../helpers/use-update-post-draft"
import { getSectionTypeLabel } from "../helpers/get-section-type-label"

export interface PostSectionsEditorContextValue {
  sectionIds: Record<"id", string>[]
  postSections: PostSection[]
  onCreate: (type: PostSectionType) => void
  onDuplicate: (id, newPostSection: PostSection, shouldEdit?: boolean) => void
  onDelete: (postSection: PostSection) => void
  onSort: (sortedItems: { id: string; value: string }[]) => void
  addItem: (sectionId: { value: string } | { value: string }[]) => void
  insertItem: (index: number, sectionId: { value: string }) => void
  removeItem: (index: number | number[]) => void
  refetchPostSections: () => void
  isCreating: boolean
}

export const PostSectionsEditorContext =
  createContext<PostSectionsEditorContextValue>({} as any)

export const PostSectionsEditorProvider = ({ children }) => {
  const navigate = useNavigate()
  const { watch } = useFormContext()
  const { post, postTypeLabel } = usePostContext()
  const { getValues, control } = useFormContext()
  const { fields, append, remove, replace, insert } = useFieldArray({
    control,
    name: "section_ids",
  })
  const uniqueSectionIds = useMemo(
    () => fields.map((s: any) => s.value),
    [fields]
  )
  const { updatePostDraft } = useUpdatePostDraft()
  // const { mutateAsync: updatePost } = useAdminUpdatePost(post.id, post.type)
  const { mutateAsync: createPostSection, isLoading: isCreating } =
    useAdminCreatePostSection()

  const watchTitle = watch("title")

  const { post_sections: postSections, refetch: refetchPostSections } =
    useGetPostSections(
      {
        id: uniqueSectionIds?.length ? uniqueSectionIds : "null", // Avoid fetching all sections if uniqueSectionIds is empty
        limit: 999999,
      },
      {
        keepPreviousData: true,
      }
    )

  const updatePost = () => {
    updatePostDraft(
      {
        section_ids: getValues("section_ids").map((s) => s.value),
      },
      refetchPostSections
    )
  }

  const addItem = (sectionId: { value: string } | { value: string }[]) => {
    append(sectionId)
    updatePost()
  }

  const insertItem = (index: number, sectionId: { value: string }) => {
    insert(index, sectionId)
    updatePost()
  }

  const removeItem = (index: number | number[]) => {
    remove(index)
    updatePost()
  }

  const handleDeleteSection = (postSection: PostSection) => {
    // Remove all occurrences of the post section id from the section_ids array.
    const indexesToRemove: number[] = fields.reduce(
      (acc: number[], curr: any, index: number) => {
        if (curr.value === postSection.id) {
          acc.push(index)
        }

        return acc
      },
      []
    )

    remove(indexesToRemove)
    updatePost()
  }

  const handleSortSections = (sortedItems: { value: string }[]) => {
    replace(sortedItems)
    updatePost()
  }

  const handleCreateSection = async (type: PostSectionType) => {
    const {
      data: { post_section },
    } = await createPostSection({
      type,
      status: PostSectionStatus.DRAFT,
      name: `${
        post.title || watchTitle || `Untitled ${postTypeLabel}`
      } - ${getSectionTypeLabel(type)}`,
      content: {},
      settings: {},
    })

    // NOTE: We need to manually update the live preview when a post section is created
    // so we can set it as active when we initially navigate to the edit view.
    updateLivePreviewPostData({ post, sections: [post_section] })

    // NOTE: We need to wait until the post section data has been pushed to the live preview,
    // or else the active section will not be properly highlighted in the live preview.
    setTimeout(() => {
      addItem({ value: post_section.id })
      navigate(
        `/admin/editor/${post.type}/${post.id}/sections/${post_section.id}`
      )
    })
  }

  const handleDuplicateSection = (
    id,
    newPostSection: PostSection,
    shouldEdit?: boolean
  ) => {
    const oldIndex = fields.findIndex((s: any) => s.value === id)

    // NOTE: We need to manually update the live preview when a post section is created
    // so we can set it as active when we initially navigate to the edit view.
    updateLivePreviewPostData({
      post,
      sections: [newPostSection],
      sectionIndex: oldIndex + 1,
    })

    // NOTE: We need to wait until the post section data has been pushed to the live preview,
    // or else the active section will not be properly highlighted in the live preview.
    setTimeout(() => {
      insertItem(oldIndex + 1, { value: newPostSection.id })

      if (shouldEdit) {
        navigate(
          `/admin/editor/${post.type}/${post.id}/sections/${newPostSection.id}`
        )
      } else {
        // If we don't want to edit the section, we need to manually set the active section in the live preview
        updateLivePreviewActiveSection(newPostSection.id)
      }
    })
  }

  return (
    <PostSectionsEditorContext.Provider
      value={{
        sectionIds: fields,
        postSections: postSections || [],
        refetchPostSections,
        onCreate: handleCreateSection,
        onDuplicate: handleDuplicateSection,
        onDelete: handleDeleteSection,
        onSort: handleSortSections,
        addItem,
        insertItem,
        removeItem,
        isCreating,
      }}
    >
      {children}
    </PostSectionsEditorContext.Provider>
  )
}

export const usePostSectionsEditorContext = () =>
  useContext(PostSectionsEditorContext)
