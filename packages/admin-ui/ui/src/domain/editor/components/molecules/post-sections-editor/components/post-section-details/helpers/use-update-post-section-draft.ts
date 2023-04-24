import { useCallback, useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import debounce from "lodash/debounce"
import isEqual from "lodash/isEqual"
import set from "lodash/set"
import omit from "lodash/omit"
import { useAdminUpdatePostSection } from "../../../../../../../../hooks/admin/post-sections"
import { PostSectionStatus } from "../../../../../../../../types/shared"
import { PostSectionFormValues } from "../../../types"
import { updateLivePreviewPostData } from "../../../../../../helpers/update-live-preview-post-data"
import { usePostContext } from "../../../../../../context"
import { usePostSectionContext } from "../context/post-section-context"
import { prepareValuesToSave } from "./prepare-values-to-save"

const defaultWatchedFields = ["name", "content", "settings", "styles"]

export interface UseUpdatePostSectionDraftOptions {
  watchedFields?: string[]
  disableAutoSave?: boolean
}

export function useUpdatePostSectionDraft(
  options?: UseUpdatePostSectionDraftOptions
) {
  const { watchedFields = [], disableAutoSave } = options || {}
  const combinedWatchedFields = [...defaultWatchedFields, ...watchedFields]

  const { post } = usePostContext()
  const { postSection, onDraftSave, setIsAutoSaving } = usePostSectionContext()
  const { mutateAsync } = useAdminUpdatePostSection(postSection?.id || "")

  const [isInitialized, setIsInitialized] = useState(false)
  const [lastUpdatedPostSectionValues, setLastUpdatedPostSectionValues] =
    useState<PostSectionFormValues>()

  const watchedStatus = useWatch({ name: "status" })
  const watchedValues = useWatch({ name: combinedWatchedFields })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePostSectionDraft = useCallback(
    debounce(
      async (payload) => {
        if (!post) return
        if (!postSection) return
        if (disableAutoSave) return

        const data: PostSectionFormValues = combinedWatchedFields.reduce(
          (acc, field, index) => {
            set(acc, field, payload[index])

            return acc
          },
          {}
        ) as PostSectionFormValues

        const formattedValues = prepareValuesToSave({
          ...data,
          status: watchedStatus,
          type: postSection.type,
        })

        const valuesWithoutTime = omit(formattedValues, [
          "content.text.value.time",
        ]) as PostSectionFormValues

        if (!isEqual(lastUpdatedPostSectionValues, valuesWithoutTime)) {
          setLastUpdatedPostSectionValues(valuesWithoutTime)

          updateLivePreviewPostData({
            post,
            sections: [{ id: postSection.id, ...formattedValues }],
          })
        }

        if (watchedStatus === PostSectionStatus.PUBLISHED) return

        setIsAutoSaving(true)

        try {
          const {
            data: { post_section: updated },
          } = await mutateAsync(formattedValues)
          onDraftSave(updated)
          setTimeout(() => setIsAutoSaving(false), 250)
        } catch (error) {
          setTimeout(() => setIsAutoSaving(false), 250)
        }
      },
      250,
      { trailing: true }
    ),
    [postSection?.id, watchedStatus, disableAutoSave]
  )

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    } else {
      updatePostSectionDraft(watchedValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues])
}
