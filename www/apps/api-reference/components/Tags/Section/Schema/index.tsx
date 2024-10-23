"use client"

import { Suspense, useEffect, useMemo, useRef } from "react"
import { SchemaObject } from "../../../../types/openapi"
import TagOperationParameters from "../../Operation/Parameters"
import {
  Badge,
  CodeBlock,
  isElmWindow,
  useIsBrowser,
  useScrollController,
  useSidebar,
} from "docs-ui"
import { SidebarItemSections } from "types"
import getSectionId from "../../../../utils/get-section-id"
import DividedLayout from "../../../../layouts/Divided"
import SectionContainer from "../../../Section/Container"
import useSchemaExample from "../../../../hooks/use-schema-example"
import { InView } from "react-intersection-observer"
import checkElementInViewport from "../../../../utils/check-element-in-viewport"
import { singular } from "pluralize"
import clsx from "clsx"

export type TagSectionSchemaProps = {
  schema: SchemaObject
  tagName: string
}

const TagSectionSchema = ({ schema, tagName }: TagSectionSchemaProps) => {
  const paramsRef = useRef<HTMLDivElement>(null)
  const { addItems, setActivePath, activePath } = useSidebar()
  const tagSlugName = useMemo(() => getSectionId([tagName]), [tagName])
  const formattedName = useMemo(
    () => singular(tagName).replaceAll(" ", ""),
    [tagName]
  )
  const schemaSlug = useMemo(
    () => getSectionId([tagName, formattedName, "schema"]),
    [tagName, formattedName]
  )
  const { examples } = useSchemaExample({
    schema,
    options: {
      skipNonRequired: false,
    },
  })
  const { isBrowser } = useIsBrowser()

  const { scrollableElement, scrollToElement } = useScrollController()
  const root = useMemo(() => {
    if (!isBrowser) {
      return
    }

    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [isBrowser, scrollableElement])

  useEffect(() => {
    addItems(
      [
        {
          type: "link",
          path: schemaSlug,
          title: `${formattedName} Object`,
          additionalElms: <Badge variant="neutral">Schema</Badge>,
          loaded: true,
        },
      ],
      {
        section: SidebarItemSections.DEFAULT,
        parent: {
          title: tagName,
          path: tagSlugName,
          changeLoaded: true,
        },
        indexPosition: 0,
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedName])

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    if (schemaSlug === (activePath || location.hash.replace("#", ""))) {
      const elm = document.getElementById(schemaSlug) as HTMLElement
      if (!checkElementInViewport(elm, 0)) {
        scrollToElement(elm)
      }
    }
  }, [activePath, schemaSlug, isBrowser])

  const handleViewChange = (
    inView: boolean,
    entry: IntersectionObserverEntry
  ) => {
    if (!isBrowser) {
      return
    }

    const section = entry.target

    if (
      (inView || checkElementInViewport(section, 10)) &&
      activePath !== schemaSlug
    ) {
      // can't use next router as it doesn't support
      // changing url without scrolling
      history.pushState({}, "", `#${schemaSlug}`)
      setActivePath(schemaSlug)
    }
  }

  return (
    <Suspense>
      <InView
        as="div"
        id={schemaSlug}
        initialInView={true}
        onChange={handleViewChange}
        root={root}
        threshold={0.1}
      >
        <DividedLayout
          mainContent={
            <SectionContainer ref={paramsRef}>
              <h2>{formattedName} Object</h2>
              <h4 className="border-medusa-border-base border-b py-1.5 mt-2">
                Fields
              </h4>
              <TagOperationParameters schemaObject={schema} topLevel={true} />
            </SectionContainer>
          }
          codeContent={
            <SectionContainer noDivider>
              {examples.length && (
                <CodeBlock
                  source={examples[0].content}
                  lang="json"
                  title={`The ${formattedName} Object`}
                  className={clsx("overflow-auto")}
                  style={{
                    maxHeight: "100vh",
                  }}
                />
              )}
            </SectionContainer>
          }
        />
      </InView>
    </Suspense>
  )
}

export default TagSectionSchema
