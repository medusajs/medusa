// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents"
import MDXInlineCode from "@site/src/components/MDXComponents/InlineCode"
import CloudinaryImage from "@site/src/components/CloudinaryImage"
import MDXDetails from "./Details"
import MDXA from "./A"
import { Kbd, DetailsSummary } from "docs-ui"

export default {
  // Re-use the default mapping
  ...MDXComponents,
  inlineCode: MDXInlineCode,
  img: CloudinaryImage,
  details: MDXDetails,
  summary: DetailsSummary,
  a: MDXA,
  kbd: Kbd,
}
