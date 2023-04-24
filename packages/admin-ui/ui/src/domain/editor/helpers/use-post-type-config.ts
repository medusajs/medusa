import merge from "lodash/merge"
import { Post, Product } from "@medusajs/medusa"
import { PostSectionType, PostType } from "../../../types/shared"
import { useBasePath } from "../../../utils/routePathing"

export interface PostTypeSectionsFeatureFlagObject {
  [PostSectionType.BUTTON_LIST]?: boolean
  [PostSectionType.CTA]?: boolean
  [PostSectionType.HEADER]?: boolean
  [PostSectionType.HERO]?: boolean
  [PostSectionType.PRODUCT_CAROUSEL]?: boolean
  [PostSectionType.PRODUCT_GRID]?: boolean
  [PostSectionType.RAW_HTML]?: boolean
  [PostSectionType.RICH_TEXT]?: boolean
}

export type PostTypeSectionsFeatureFlagArray = PostSectionType[]

export interface PostTypeConfigFeatureFlags {
  /**
   * Determines whether the post type supports the title field
   *
   * Default: `true`
   */
  title?: boolean | "readonly"

  /**
   * Determines whether the post type supports the handle field
   *
   * Default: `true`
   */
  handle?: boolean | "readonly"

  /**
   * Determines whether the post type supports the status toggle
   *
   * Default: `true`
   */
  status?: boolean | "readonly"

  /**
   * Determines whether the post type supports the settings sidebar.
   *
   * Default: `true`
   */
  settings?: boolean

  /**
   * Determines whether the post type supports the excerpt field
   *
   * Default: `false`
   */
  excerpt?: boolean | "readonly"

  /**
   * Determines whether the post type supports the authors field
   *
   * Default: `false`
   */
  authors?: boolean | "readonly"

  /**
   * Determines whether the post type supports the tags field
   *
   * Default: `false`
   */
  tags?: boolean | "readonly"

  /**
   * Determines the display of the featured image field
   *
   * Default: `false`
   */
  featured_image?: boolean | "readonly"

  /**
   * Determines the of display of duplicate button as well as the capability to delete a post.
   *
   * Default: `true`
   */
  duplicate?: boolean

  /**
   * Determines the of display of delete button as well as the capability to delete a post.
   *
   * Default: `true`
   */
  delete?: boolean

  /**
   * Determines whether the post type supports the "View Preview" button.
   *
   * Default: `true`
   */
  view_preview?: boolean

  /**
   * Determines whether the post type supports the "View {POST_TYPE}" button.
   *
   * Default: `true`
   */
  view_live?: boolean

  /**
   * Determines whether the post type supports settings related to the home page.
   *
   * Reserved for `page` post type. Throw an error if other post types try to enable it.
   *
   * Default: `false`
   */
  home_page?: boolean

  /**
   * Determines the display of the content mode toggle and determines whether to set to `'advanced'` or `'basic'` by default
   *
   * Default: `'default_advanced'`
   */
  content_mode?:
    | "default_advanced"
    | "default_basic"
    | "advanced_only"
    | "basic_only"

  /**
   * Determines whether the post type supports the content field
   *
   * Will be disregarded if `content_mode` is set to `basic_only` or `advanced_only`
   *
   * Default: `true`
   */
  content?: boolean | "readonly"

  /**
   * Determines the display of the post sections
   *
   * Will be disregarded if `content_mode` is set to `basic_only` or `advanced_only`
   *
   * Default: `true`
   */
  sections?:
    | boolean
    | "readonly"
    | PostTypeSectionsFeatureFlagObject
    | PostTypeSectionsFeatureFlagArray
}

export interface PostTypeConfigValueOverrides {
  title?: string
  handle?: string
}

export interface PostTypeConfig {
  label: string
  storefrontURLPath: string
  adminBackURLPath: string
  adminBackButtonLabel: string
  draftSavedNotifcationTitle: string
  draftSavedNotifcationMessage: string
  publishedNotificationTitle: string
  publishedNotificationMessage: string
  featureFlags: PostTypeConfigFeatureFlags
  valueOverrides?: PostTypeConfigValueOverrides
}

export const usePostTypeConfig = ({
  post,
  product,
}: {
  post: Post
  product?: Product
}): PostTypeConfig => {
  const basePath = useBasePath()

  const defaultConfig: Partial<PostTypeConfig> = {
    label: "",
    storefrontURLPath: "/",
    adminBackURLPath: `/admin/content/${post.type}s`,
    featureFlags: {
      title: true,
      handle: true,
      status: true,
      tags: false,
      excerpt: false,
      authors: false,
      featured_image: false,
      home_page: false,
      duplicate: true,
      delete: true,
      content_mode: "default_advanced",
      content: true,
      sections: true,
      view_preview: true,
      view_live: true,
      settings: true,
    },
  }

  const configByPostType: Partial<Record<PostType, Partial<PostTypeConfig>>> = {
    [PostType.PAGE]: {
      label: "Page",
      storefrontURLPath: "",
      featureFlags: {
        home_page: true,
      },
    },
    [PostType.POST]: {
      label: "Post",
      storefrontURLPath: "/blog",
      featureFlags: {
        content_mode: "basic_only",
        excerpt: true,
        featured_image: true,
        tags: true,
        authors: true,
      },
    },
    [PostType.PRODUCT]: {
      label: "Product",
      storefrontURLPath: "/products",
      adminBackURLPath: `${basePath}/products/${post.product_id}`,
      adminBackButtonLabel: "Product",
      publishedNotificationTitle: "Updated",
      publishedNotificationMessage: "Product page updated.",
      featureFlags: {
        content_mode: "advanced_only",
        title: "readonly",
        handle: "readonly",
        status: false,
        duplicate: false,
        delete: false,
        view_preview: false,
        view_live: product?.status === "published",
        settings: false,
      },
      valueOverrides: {
        title: product?.title || "",
        handle: product?.handle || "",
      },
    },
  }

  return merge({}, defaultConfig, configByPostType[post.type]) as PostTypeConfig
}
