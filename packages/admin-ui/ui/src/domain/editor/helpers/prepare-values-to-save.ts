import { PostContentMode } from "../../../types/shared"
import { PostDetailsFormValues } from "./get-default-values"
import { PostTypeConfig } from "./use-post-type-config"

export const prepareValuesToSave = (
  values: PostDetailsFormValues,
  { featureFlags }: PostTypeConfig
) => {
  const preparedValues = { ...values }

  const canEdit = (flag: keyof typeof featureFlags) =>
    featureFlags[flag] === true

  if (!canEdit("title")) {
    delete preparedValues.title
  }

  if (!canEdit("handle")) {
    delete preparedValues.handle
  }

  if (!canEdit("status")) {
    delete preparedValues.status
  }

  if (!canEdit("excerpt")) {
    delete preparedValues.excerpt
  }

  if (!canEdit("authors")) {
    delete preparedValues.author_ids
  }

  if (!canEdit("tags")) {
    delete preparedValues.tag_ids
  }

  if (!canEdit("featured_image")) {
    delete preparedValues.featured_image_id
    delete preparedValues.featured_image
  }

  if (!canEdit("home_page")) {
    delete preparedValues.is_home_page
  }

  if (!canEdit("content")) {
    delete preparedValues.content
  }

  if (!canEdit("sections")) {
    delete preparedValues.section_ids
  }

  if (featureFlags["content_mode"] === "advanced_only") {
    preparedValues.content_mode = PostContentMode.ADVANCED
  }

  if (featureFlags["content_mode"] === "basic_only") {
    preparedValues.content_mode = PostContentMode.BASIC
  }

  return preparedValues
}
