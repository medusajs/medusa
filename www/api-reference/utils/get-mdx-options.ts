import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypePrism from "@mapbox/rehype-prism"

export default () => {
  return {
    remarkPlugins: [rehypeMdxCodeProps],
    rehypePlugins: [rehypePrism],
  }
}