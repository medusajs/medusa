import { PostSectionType } from "../../../../../../../types/shared"
import { usePostSectionContext } from "./context"
import {
  ButtonListForm,
  CTAForm,
  HeaderForm,
  HeroForm,
  ProductListForm,
  RawHTMLForm,
  RichTextForm,
} from "./forms/content"

const forms = {
  [PostSectionType.BUTTON_LIST]: ButtonListForm,
  [PostSectionType.CTA]: CTAForm,
  [PostSectionType.HEADER]: HeaderForm,
  [PostSectionType.HERO]: HeroForm,
  [PostSectionType.PRODUCT_CAROUSEL]: ProductListForm,
  [PostSectionType.PRODUCT_GRID]: ProductListForm,
  [PostSectionType.RAW_HTML]: RawHTMLForm,
  [PostSectionType.RICH_TEXT]: RichTextForm,
}

export const PostSectionContentForm = () => {
  const { postSection } = usePostSectionContext()
  const ContentForm = forms[postSection.type]

  return (
    <div className="flex flex-col gap-4">
      <h2 className="inter-large-semibold mt-0">Content</h2>
      {ContentForm ? <ContentForm /> : null}
    </div>
  )
}
