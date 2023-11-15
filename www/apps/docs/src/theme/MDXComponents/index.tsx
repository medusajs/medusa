// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents"
import CloudinaryImage from "@site/src/components/CloudinaryImage"
import MDXA from "./A"
import { Kbd, DetailsSummary } from "docs-ui"
import H1 from "./H1"
import MDXCode from "./Code"
import MDXDetails from "./Details"

export default {
  // Re-use the default mapping
  ...MDXComponents,
  code: MDXCode,
  img: CloudinaryImage,
  details: MDXDetails,
  Details: MDXDetails,
  Summary: DetailsSummary,
  a: MDXA,
  kbd: Kbd,
  h1: H1,
}
