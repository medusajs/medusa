import React from "react"
import TOCItems from "@theme-original/TOCItems"
import type TOCItemsType from "@theme/TOCItems"
import type { WrapperProps } from "@docusaurus/types"
import StructuredDataHowTo from "@site/src/components/StructuredData/HowTo"
import { useDoc } from "@docusaurus/theme-common/internal"
import { DocContextValue } from "@medusajs/docs"

type Props = WrapperProps<typeof TOCItemsType>

export default function TOCItemsWrapper(props: Props): JSX.Element {
  const { frontMatter, contentTitle } = useDoc() as DocContextValue

  return (
    <>
      <TOCItems {...props} />
      {frontMatter?.addHowToData && (
        <StructuredDataHowTo toc={props.toc} title={contentTitle} />
      )}
    </>
  )
}
