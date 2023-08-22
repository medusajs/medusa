// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents"
import MDXInlineCode from "@site/src/components/MDXComponents/InlineCode"
import CloudinaryImage from "@site/src/components/CloudinaryImage"
import MDXDetails from "./Details"
import MDXSummary from "./Summary"
import MDXA from "./A"

export default {
  // Re-use the default mapping
  ...MDXComponents,
  inlineCode: MDXInlineCode,
  img: CloudinaryImage,
  details: MDXDetails,
  summary: MDXSummary,
  a: MDXA,
}
