export declare type FrontMatter = {
  slug?: string
  sidebar_label?: string
  sidebar_group?: string
  sidebar_group_main?: boolean
  sidebar_position?: number
  sidebar_autogenerate_exclude?: boolean
  sidebar_description?: string
  tags?: (
    | string
    | {
        name: string
        label: string
      }
  )[]
  title?: string
  description?: string
  products?: string[]
  toc_max_depth?: number
  generate_toc?: boolean
  allow_nontext_toc?: boolean
  hide_content_menu?: boolean
  keywords?: string[]
}
