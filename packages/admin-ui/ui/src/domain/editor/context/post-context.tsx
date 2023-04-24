import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Post, Product } from "@medusajs/medusa"
import useNotification from "../../../hooks/use-notification"
import { checkHandle } from "../helpers/check-handle"
import { useAdminUpdatePost } from "../../../hooks/admin/posts"
import { useGetSiteSettings } from "../../../hooks/admin"
import { getErrorMessage } from "../../../utils/error-messages"
import { useWindowBeforeUnload } from "../../../hooks/use-window-before-unload"
import { PostContentMode, PostStatus } from "../../../types/shared"
import {
  PostTypeConfigValueOverrides,
  PostTypeConfigFeatureFlags,
  usePostTypeConfig,
} from "../helpers/use-post-type-config"
import { getDefaultValues } from "../helpers/get-default-values"
import { prepareValuesToSave } from "../helpers/prepare-values-to-save"

export interface PostContextValue {
  post: Post
  postTypeLabel: string
  isDraft: boolean
  isPublished: boolean
  isHomePage: boolean
  isBasicMode: boolean
  isAdvancedMode: boolean
  isSettingsOpen: boolean
  setIsSettingsOpen: (value: boolean) => void
  toggleSettings: (value?: boolean) => void
  isEditorOpen: boolean
  setIsEditorOpen: (value: boolean) => void
  toggleEditor: (value?: boolean) => void
  isAutoSaving: boolean
  setIsAutoSaving: (value: boolean) => void
  shouldConfirmLeavePost: boolean
  setShouldConfirmLeavePost: (value: boolean) => void
  shouldConfirmLeaveSection: boolean
  setShouldConfirmLeaveSection: (value: boolean) => void
  confirmLeave: {
    from: "post" | "section"
    context: "post" | "section"
    navigateTo: string
  } | null
  setConfirmLeave: (params: PostContextValue["confirmLeave"]) => void
  onSave: (values?: any) => void
  liveURLPath: string
  liveBaseURL: string
  liveURL: string
  previewURL: string
  storefrontURL: string
  backURLPath: string
  backButtonLabel: string
  valueOverrides?: PostTypeConfigValueOverrides
  featureFlags: PostTypeConfigFeatureFlags
}

export const PostContext = createContext<PostContextValue>(
  {} as PostContextValue
)

export const usePostContext = () => useContext(PostContext)

export interface PostProviderProps {
  post: Post
  product?: Product
  isLoading?: boolean
}

export const PostProvider: FC<PropsWithChildren<PostProviderProps>> = ({
  post,
  product,
  isLoading,
  children,
  ...props
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(!!isLoading)
  const [shouldConfirmLeavePost, setShouldConfirmLeavePost] =
    useState<boolean>(false)
  const [shouldConfirmLeaveSection, setShouldConfirmLeaveSection] =
    useState<boolean>(false)
  const [confirmLeave, setConfirmLeave] =
    useState<PostContextValue["confirmLeave"]>(null)

  const { site_settings: siteSettings } = useGetSiteSettings()
  const { mutateAsync: updatePost } = useAdminUpdatePost(post.id, post.type)
  const notification = useNotification({ position: "bottom-left" })
  const postTypeConfig = usePostTypeConfig({ post, product })
  const defaultValues = getDefaultValues(post, postTypeConfig)
  const formMethods = useForm({ defaultValues })

  const storefrontURL = (
    siteSettings?.storefront_url || "http://localhost:3000"
  ).replace(/\/$/, "")

  const contentMode = formMethods.watch("content_mode")

  const isHomePage = !!defaultValues?.is_home_page

  const isDraft =
    !defaultValues?.status || defaultValues?.status === PostStatus.DRAFT
  const isPublished = defaultValues?.status === PostStatus.PUBLISHED

  const isBasicMode = contentMode === PostContentMode.BASIC
  const isAdvancedMode = contentMode === PostContentMode.ADVANCED

  const postTypeLabel = postTypeConfig.label
  const valueOverrides = postTypeConfig.valueOverrides
  const featureFlags = postTypeConfig.featureFlags
  const liveURLPath = postTypeConfig.storefrontURLPath
  const backURLPath = postTypeConfig.adminBackURLPath
  const backButtonLabel =
    postTypeConfig.adminBackButtonLabel || `${postTypeLabel}s`

  const liveBaseURL = `${storefrontURL}${liveURLPath}`
  const liveURL =
    valueOverrides?.handle || post.handle || isHomePage
      ? `${liveBaseURL}${
          valueOverrides?.handle || post.handle
            ? `/${valueOverrides?.handle || post.handle}`
            : ""
        }`
      : ""
  const previewURL = `${storefrontURL}/preview/${post.id}`

  const toggleSettings = (newValue?: boolean) =>
    setIsSettingsOpen((value) =>
      typeof newValue === "boolean" ? newValue : !value
    )

  const toggleEditor = (newValue?: boolean) =>
    setIsEditorOpen((value) =>
      typeof newValue === "boolean" ? newValue : !value
    )

  const handleSave = async () => {
    const handle = formMethods.getValues("handle")
    const title = formMethods.getValues("title")
    const featuredImage = formMethods.getValues("featured_image")
    const shouldSetAsHomePage = formMethods.getValues("is_home_page")

    if (featureFlags.handle === true && !handle && !shouldSetAsHomePage) {
      // Ensure we have a handle
      const { suggestedHandle } = await checkHandle(
        title || "untitled",
        post?.id
      )
      formMethods.setValue("handle", suggestedHandle)
    }

    try {
      const values = prepareValuesToSave(
        formMethods.getValues(),
        postTypeConfig
      )

      const { data } = await updatePost({
        ...values,
        section_ids: values.section_ids?.map((s) => s.value),
        featured_image: featuredImage?.url || null,
      })

      const updatedPost = data.post

      const notifications = {
        published: {
          title: postTypeConfig.publishedNotificationTitle || "Published",
          message: (
            <>
              {postTypeConfig.publishedNotificationMessage || (
                <>{postTypeLabel} published to live site.</>
              )}
              {postTypeConfig.featureFlags.view_live && (
                <a
                  href={liveURL}
                  className="inline-block ml-2 underline"
                  target="_blank"
                >
                  View {post.type}
                </a>
              )}
            </>
          ),
        },
        draft: {
          title: postTypeConfig.draftSavedNotifcationTitle || "Saved",
          message: (
            <>
              {postTypeConfig.draftSavedNotifcationMessage || (
                <>{postTypeLabel} saved as draft.</>
              )}
              {postTypeConfig.featureFlags.view_preview && (
                <a
                  href={previewURL}
                  className="inline-block ml-2 underline"
                  target="_blank"
                >
                  View preview
                </a>
              )}
            </>
          ),
        },
      }

      notification(
        notifications[updatedPost.status].title,
        notifications[updatedPost.status].message,
        "success"
      )

      formMethods.reset(getDefaultValues(updatedPost, postTypeConfig))
    } catch (error) {
      notification(
        `Failed to save ${post.type}`,
        getErrorMessage(error),
        "error"
      )
    }
  }

  useWindowBeforeUnload({
    preventUnload: shouldConfirmLeaveSection || shouldConfirmLeavePost,
  })

  useEffect(() => {
    // NOTE: Set a flag when the post has unsaved changes to prevent the
    // user from leaving the post before confirming.
    setShouldConfirmLeavePost(isPublished && formMethods.formState.isDirty)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublished, formMethods.formState.isDirty])

  return (
    <PostContext.Provider
      value={{
        ...props,
        post,
        postTypeLabel: postTypeConfig.label,
        valueOverrides,
        liveURLPath,
        liveBaseURL,
        liveURL,
        previewURL,
        storefrontURL,
        backURLPath,
        backButtonLabel,
        onSave: formMethods.handleSubmit(handleSave),
        isDraft,
        isPublished,
        isHomePage,
        isBasicMode,
        isAdvancedMode,
        isSettingsOpen,
        setIsSettingsOpen,
        toggleSettings,
        isEditorOpen,
        setIsEditorOpen,
        toggleEditor,
        isAutoSaving,
        setIsAutoSaving,
        shouldConfirmLeavePost,
        setShouldConfirmLeavePost,
        shouldConfirmLeaveSection,
        setShouldConfirmLeaveSection,
        confirmLeave,
        setConfirmLeave,
        featureFlags,
      }}
    >
      <FormProvider {...formMethods}>
        <input type="hidden" {...formMethods.register("is_home_page")} />
        {children}
      </FormProvider>
    </PostContext.Provider>
  )
}
