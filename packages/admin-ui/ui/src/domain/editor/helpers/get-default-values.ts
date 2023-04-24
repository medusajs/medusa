import { Post } from "@medusajs/medusa"
import { AdminUpdatePostReq } from "../../../hooks/admin/posts"
import { ImageFile } from "../../../hooks/use-upload-file"
import { PostTypeConfig } from "./use-post-type-config"
import { PostStatus } from "../../../types/shared"

export interface PostDetailsFormValues
  extends Partial<
    Omit<AdminUpdatePostReq, "type" | "section_ids" | "featured_image">
  > {
  section_ids?: { value: string }[]
  featured_image?: ImageFile | null
}

export const getDefaultValues = (
  post: Post,
  postTypeConfig: PostTypeConfig
): PostDetailsFormValues => {
  const { valueOverrides } = postTypeConfig

  return {
    title: valueOverrides?.title || post.title,
    handle: valueOverrides?.handle || post.handle,
    status: (valueOverrides?.status || post.status) as PostStatus,
    content: post.content,
    content_mode: post.content_mode,
    excerpt: post.excerpt,
    section_ids: post.sections.map((section) => ({
      value: section.id,
    })),
    tag_ids: post.tags.map((a) => a.id),
    author_ids: post.authors.map((a) => a.id),
    featured_image: { url: post.featured_image?.url },
    is_home_page: post.is_home_page,
  }
}
