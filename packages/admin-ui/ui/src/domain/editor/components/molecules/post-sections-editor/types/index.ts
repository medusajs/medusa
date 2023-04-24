import {
  CustomAction,
  TranslatableField,
  TranslatableRichTextField,
  ImageField,
} from "@medusajs/medusa"
import {
  PostSectionStatus,
  PostSectionType,
} from "../../../../../../types/shared"

export interface BaseSectionContent {
  heading?: TranslatableField
  text?: TranslatableRichTextField
  actions?: CustomAction[]
}

export interface BaseSectionContentWithImage {
  image?: ImageField
}

export interface ButtonListContent extends BaseSectionContent {}

export interface HeroContent extends BaseSectionContentWithImage {}

export interface ProductListContent extends BaseSectionContent {
  include_collection_tabs?: boolean
  collection_tab_id?: { value: string }[]
  product_select: "id" | "filter"
  product_id?: string[]
  product_filter: {
    q?: string
    collection_id?: string[]
    tags?: string[]
    vendor_id?: string[]
    order?: string
    limit?: number
  }
}

export interface RichTextContent extends BaseSectionContent {}

export interface RawHTMLContent extends BaseSectionContent {
  html: TranslatableField
}

export type PostSectionContent =
  | BaseSectionContent
  | ButtonListContent
  | HeroContent
  | ProductListContent
  | RichTextContent
  | RawHTMLContent

export interface BaseSectionStyles {}

export interface BaseSectionSettings {}

export interface BaseSectionFormValues {
  type: PostSectionType
  status: PostSectionStatus
  name: string
  content: PostSectionContent
  styles?: BaseSectionStyles // TODO: Add styles type
  settings?: BaseSectionSettings
  is_reusable?: boolean
}

export interface ButtonListFormValues extends BaseSectionFormValues {
  content: ButtonListContent
}

export interface CTAFormValues extends BaseSectionFormValues {}

export interface HeaderFormValues extends BaseSectionFormValues {}

export interface HeroFormValues extends BaseSectionFormValues {
  content: HeroContent
}

export interface ProductListFormValues extends BaseSectionFormValues {
  content: ProductListContent
}

export interface RichTextFormValues extends BaseSectionFormValues {
  content: RichTextContent
}

export interface RawHTMLFormValues extends BaseSectionFormValues {
  content: RawHTMLContent
}

export type PostSectionFormValues =
  | ButtonListFormValues
  | CTAFormValues
  | HeaderFormValues
  | HeroFormValues
  | ProductListFormValues
  | RichTextFormValues
  | RawHTMLFormValues
