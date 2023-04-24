import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { FormProvider, useForm } from "react-hook-form"
import { CustomAction, Post, PostSection } from "@medusajs/medusa"
import { useAdminUpdatePostSection } from "../../../../../../../../hooks/admin/post-sections"
import useNotification from "../../../../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../../../../utils/error-messages"
import { PostSectionFormValues } from "../../../types"
import { getDefaultValues } from "../helpers/get-default-values"
import { prepareValuesToSave } from "../helpers/prepare-values-to-save"
import { PostSectionStatus } from "../../../../../../../../types/shared"
import { usePostContext } from "../../../../../../context/post-context"

export interface AdminBasePostSectionReq {
  status: PostSection["status"]
  name?: string
  title?: string
  actions?: CustomAction[]
  content?: any
}

export interface AdminCreatePostSectionReq extends AdminBasePostSectionReq {
  type: PostSection["type"]
}

export interface AdminUpdatePostSectionReq extends AdminBasePostSectionReq {
  type?: PostSection["type"]
}

export interface PostSectionFormDefaultValues
  extends AdminUpdatePostSectionReq {}

export interface PostSectionContextValue {
  postSection: PostSection
  isDraft: boolean
  isPublished: boolean
  onSave: (values?: any) => Promise<void>
  onDraftSave: (postSection: PostSection) => Promise<void>
  onDuplicate: (id: string, newPostSection: PostSection) => Promise<void>
  onDelete: (postSection: PostSection) => Promise<void>
  isAutoSaving: boolean
  setIsAutoSaving: (value: boolean) => void
}

const PostSectionContext = createContext<PostSectionContextValue>(
  {} as PostSectionContextValue
)

export const usePostSectionContext = () => useContext(PostSectionContext)

export interface PostSectionProviderProps {
  id: string
  post?: Post
  postSection: PostSection
  onSave?: (postSection: PostSection) => void
  onDraftSave?: (postSection: PostSection) => void
  onDuplicate?: (id: string, newPostSection: PostSection) => void
  onDelete?: (postSection: PostSection) => void
  isLoading?: boolean
}

export const PostSectionProvider: FC<
  PropsWithChildren<PostSectionProviderProps>
> = ({
  post,
  postSection,
  onSave,
  onDraftSave,
  onDuplicate,
  onDelete,
  isLoading,
  children,
}) => {
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(!!isLoading)
  const navigate = useNavigate()
  const notification = useNotification({ position: "bottom-left" })
  const defaultValues = getDefaultValues(postSection)
  const formMethods = useForm<PostSectionFormValues>({
    defaultValues,
    mode: "all",
  })
  const updatePostSection = useAdminUpdatePostSection(postSection.id || "")
  const { setShouldConfirmLeaveSection } = usePostContext()

  const isDraft =
    !defaultValues?.status || defaultValues?.status === PostSectionStatus.DRAFT
  const isPublished = defaultValues?.status === PostSectionStatus.PUBLISHED

  const goBack = () => {
    if (post) navigate(`/admin/editor/${post.type}/${post.id}`)
    else navigate(-1)
  }

  const handleSave = async () => {
    try {
      const values = formMethods.getValues()

      const { data } = await updatePostSection.mutateAsync(
        prepareValuesToSave(values)
      )

      notification("Updated successfully", "Section updated.", "success")

      formMethods.reset(getDefaultValues(data.post_section))

      if (onSave) onSave(data.post_section)
    } catch (error) {
      notification("Update failed", getErrorMessage(error), "error")
    }
  }

  const handleDraftSave = async (values) => {
    if (onDraftSave) onDraftSave(values)
  }

  const handleDuplicate = async (id: string, newPostSection: PostSection) => {
    if (onDuplicate) await onDuplicate(id, newPostSection)
  }

  const handleDelete = async (postSection: PostSection) => {
    goBack()

    if (onDelete) await onDelete(postSection)
  }

  useEffect(() => {
    // NOTE: The post needs to know when a section has unsaved changes to
    // prevent the user from leaving the page or navigating between sections.
    setShouldConfirmLeaveSection(isPublished && formMethods.formState.isDirty)
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => {
      // NOTE: Reset the state when the component unmounts to prevent
      // the post from thinking that there are unsaved changes when
      // trying to leave the page.
      setShouldConfirmLeaveSection(false)
    }
  }, [isPublished, formMethods.formState.isDirty])

  return (
    <PostSectionContext.Provider
      value={{
        postSection,
        isDraft,
        isPublished,
        onSave: formMethods.handleSubmit(handleSave),
        onDraftSave: handleDraftSave,
        onDuplicate: handleDuplicate,
        onDelete: handleDelete,
        isAutoSaving,
        setIsAutoSaving,
      }}
    >
      <FormProvider {...formMethods}>
        <input type="hidden" {...formMethods.register("type")} />
        {children}
      </FormProvider>
    </PostSectionContext.Provider>
  )
}
