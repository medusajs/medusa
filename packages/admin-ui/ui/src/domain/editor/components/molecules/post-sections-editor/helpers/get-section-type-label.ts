import { PostSectionType } from "../../../../../../types/shared"

export const getSectionTypeLabel = (type: PostSectionType) => {
  const labels = {
    [PostSectionType.BUTTON_LIST]: "Button List",
    [PostSectionType.CTA]: "Call to Action",
    [PostSectionType.HEADER]: "Header",
    [PostSectionType.HERO]: "Hero",
    [PostSectionType.PRODUCT_CAROUSEL]: "Product Carousel",
    [PostSectionType.PRODUCT_GRID]: "Product Grid",
    [PostSectionType.RAW_HTML]: "Raw HTML",
    [PostSectionType.RICH_TEXT]: "Rich Text",
  }

  return labels[type]
}
