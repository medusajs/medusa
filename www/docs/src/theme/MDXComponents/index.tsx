// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents"
import MDXInlineCode from "@site/src/components/MDXComponents/InlineCode"
import CloudinaryImage from "@site/src/components/CloudinaryImage"

export default {
  // Re-use the default mapping
  ...MDXComponents,
  inlineCode: MDXInlineCode,
  img: CloudinaryImage,
}
