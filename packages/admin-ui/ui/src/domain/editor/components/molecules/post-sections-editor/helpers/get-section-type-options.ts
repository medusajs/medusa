import { PostSectionType } from "../../../../../../types/shared"
import {
  PostTypeConfigFeatureFlags,
  PostTypeSectionsFeatureFlagArray,
  PostTypeSectionsFeatureFlagObject,
} from "../../../../helpers/use-post-type-config"
import { getSectionTypeLabel } from "./get-section-type-label"

export interface PostSectionOption {
  label: string
  value: PostSectionType
}

export const getSectionTypeOptions = (
  featureFlags: PostTypeConfigFeatureFlags
): PostSectionOption[] => {
  let options = [
    {
      label: getSectionTypeLabel(PostSectionType.BUTTON_LIST),
      value: PostSectionType.BUTTON_LIST,
    },
    {
      label: getSectionTypeLabel(PostSectionType.CTA),
      value: PostSectionType.CTA,
    },
    {
      label: getSectionTypeLabel(PostSectionType.HEADER),
      value: PostSectionType.HEADER,
    },
    {
      label: getSectionTypeLabel(PostSectionType.HERO),
      value: PostSectionType.HERO,
    },
    {
      label: getSectionTypeLabel(PostSectionType.PRODUCT_CAROUSEL),
      value: PostSectionType.PRODUCT_CAROUSEL,
    },
    {
      label: getSectionTypeLabel(PostSectionType.PRODUCT_GRID),
      value: PostSectionType.PRODUCT_GRID,
    },
    {
      label: getSectionTypeLabel(PostSectionType.RAW_HTML),
      value: PostSectionType.RAW_HTML,
    },
    {
      label: getSectionTypeLabel(PostSectionType.RICH_TEXT),
      value: PostSectionType.RICH_TEXT,
    },
  ]

  if (featureFlags.sections === "readonly" || featureFlags.sections === false)
    return []

  if (Array.isArray(featureFlags.sections)) {
    options = options.filter((option) =>
      (featureFlags.sections as PostTypeSectionsFeatureFlagArray)?.includes(
        option.value
      )
    )

    return options
  }

  if (typeof featureFlags.sections === "object") {
    options = options.filter(
      (option) =>
        (featureFlags.sections as PostTypeSectionsFeatureFlagObject)?.[
          option.value
        ]
    )

    return options
  }

  return options
}
