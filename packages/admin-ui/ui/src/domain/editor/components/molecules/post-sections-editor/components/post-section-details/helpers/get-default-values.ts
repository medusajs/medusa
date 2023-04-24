import { PostSection } from "@medusajs/medusa"
import mergeWith from "lodash/mergeWith"
import omit from "lodash/omit"
import {
  PostSectionStatus,
  PostSectionType,
} from "../../../../../../../../types/shared"
import {
  BaseSectionFormValues,
  ButtonListFormValues,
  CTAFormValues,
  HeaderFormValues,
  HeroFormValues,
  PostSectionFormValues,
  ProductListFormValues,
  RawHTMLFormValues,
  RichTextFormValues,
} from "../../../types"

const mergeValues = <T extends PostSectionFormValues>(...args): T =>
  mergeWith({}, ...args, (a, b) => (b === null ? a : undefined))

const settingsDefaultValues = {
  element_id: "",
  element_class_name: "",
}

const baseStyleDefaultValues = {
  color: "",
  text_align: "",
  font_family: "",
  font_size: "",
  font_weight: "",
  background_type: "",
  background_image: {
    url: "",
  },
  background_color: "",
  background_position: "",
  background_size: "",
  background_repeat: "",
  background_video: {
    url: "",
    thumbnail: {
      url: null,
    },
  },
  background_overlay: {
    color: "",
    opacity: null,
    blur: null,
    blend_mode: null,
  },
  padding: {
    top: "",
    right: "",
    bottom: "",
    left: "",
  },
  margin: {
    top: "",
    right: "",
    bottom: "",
    left: "",
  },
  custom_css: "",
}

const stylesDefaultValues = {
  default: baseStyleDefaultValues,
  mobile: baseStyleDefaultValues,
}

const baseSectionDefaultValues = {
  status: PostSectionStatus.DRAFT,
  name: "",
  content: {
    heading: { value: "" },
    text: { value: {} },
    actions: [],
  },
  settings: settingsDefaultValues,
  styles: stylesDefaultValues,
  is_reusable: false,
}

export const getBaseSectionDefaultValues = (postSection: PostSection) =>
  mergeValues<BaseSectionFormValues>(baseSectionDefaultValues, postSection)

export const getButtonListDefaultValues = (
  postSection: PostSection
): ButtonListFormValues =>
  mergeValues<ButtonListFormValues>(
    {
      ...baseSectionDefaultValues,
      type: PostSectionType.BUTTON_LIST,
    },
    postSection
  )

export const getCTADefaultValues = (postSection: PostSection): CTAFormValues =>
  mergeValues<CTAFormValues>(
    {
      ...baseSectionDefaultValues,
      type: PostSectionType.CTA,
    },
    postSection
  )

export const getHeaderDefaultValues = (
  postSection: PostSection
): HeaderFormValues =>
  mergeValues<HeaderFormValues>(
    {
      ...baseSectionDefaultValues,
      type: PostSectionType.HEADER,
    },
    postSection
  )

export const getHeroDefaultValues = (
  postSection: PostSection
): HeroFormValues =>
  mergeValues<HeroFormValues>(
    {
      ...baseSectionDefaultValues,
      type: PostSectionType.HERO,
      content: {
        ...baseSectionDefaultValues.content,
        image: {
          url: "",
        },
      },
    },
    postSection
  )

export const getProductListDefaultValues = (postSection: PostSection) =>
  mergeValues<ProductListFormValues>(
    {
      ...baseSectionDefaultValues,
      type: postSection.type,
      content: {
        ...baseSectionDefaultValues.content,
        include_collection_tabs: false,
        collection_tab_id: [],
        product_select:
          "filter" as ProductListFormValues["content"]["product_select"],
        product_id: [],
        product_filter: {
          q: "",
          collection_id: [],
          tags: [],
          vendor_id: [],
          order: "-created_at",
          limit: 3,
        },
      },
    },
    {
      ...postSection,
      content: {
        ...postSection.content,
        collection_tab_id: postSection?.content?.collection_tab_id?.length
          ? postSection?.content?.collection_tab_id?.map((id) => ({
              value: id,
            }))
          : [],
      },
    }
  )

export const getRawHTMLDefaultValues = (postSection: PostSection) =>
  mergeValues<RawHTMLFormValues>(
    {
      ...omit(baseSectionDefaultValues, "content"),
      type: PostSectionType.RAW_HTML,
      content: {
        html: { value: "" },
      },
    },
    postSection
  )

export const getRichTextDefaultValues = (postSection: PostSection) =>
  mergeValues<RichTextFormValues>(
    {
      ...omit(baseSectionDefaultValues, "content"),
      type: PostSectionType.RICH_TEXT,
      content: {
        text: { value: {} },
      },
    },
    postSection
  )

export function getDefaultValues(
  postSection: PostSection
): PostSectionFormValues {
  const defaultValuesByType = {
    [PostSectionType.BUTTON_LIST]: getButtonListDefaultValues,
    [PostSectionType.CTA]: getCTADefaultValues,
    [PostSectionType.HEADER]: getHeaderDefaultValues,
    [PostSectionType.HERO]: getHeroDefaultValues,
    [PostSectionType.PRODUCT_CAROUSEL]: getProductListDefaultValues,
    [PostSectionType.PRODUCT_GRID]: getProductListDefaultValues,
    [PostSectionType.RAW_HTML]: getRawHTMLDefaultValues,
    [PostSectionType.RICH_TEXT]: getRichTextDefaultValues,
  }

  const defaultValues = omit(
    defaultValuesByType[postSection.type](postSection),
    "id",
    "created_at",
    "updated_at",
    "last_updated_by_id",
    "last_updated_by",
    "usage_count"
  )

  return defaultValues as PostSectionFormValues
}
