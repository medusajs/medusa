// Import the original mapper
import React from "react"
import MDXComponents from "@theme-original/MDXComponents"
import CloudinaryImage from "@site/src/components/CloudinaryImage"
import MDXA from "./A"
import { Kbd, DetailsSummary, Note, MermaidDiagram } from "docs-ui"
import H1 from "./H1"
import MDXCode from "./Code"
import MDXDetails from "./Details"
import DocCard from "@theme/DocCard"
import DocCardList from "@theme/DocCardList"
import { Props as MermaidProps } from "@theme/Mermaid"

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
  mermaid: ({ value }: MermaidProps) => (
    <MermaidDiagram diagramContent={value} />
  ),
}

export default components
