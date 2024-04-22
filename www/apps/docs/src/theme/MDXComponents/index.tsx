// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents"
import CloudinaryImage from "@site/src/components/CloudinaryImage"
import MDXA from "./A"
import { Kbd, DetailsSummary, Note } from "docs-ui"
import H1 from "./H1"
import MDXCode from "./Code"
import MDXDetails from "./Details"
import DocCard from "@theme/DocCard"
import DocCardList from "@theme/DocCardList"

const components = {
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
  DocCard,
  DocCardList,
  Note,
}

export default components
