"use client"

import React from "react"
import { Suspense, useEffect, useMemo } from "react"
import { OpenAPI } from "types"
import TagOperationParameters from "../../Operation/Parameters"
import {
  CodeBlock,
  isElmWindow,
  Link,
  Note,
  useIsBrowser,
  useScrollController,
  useSidebar,
} from "docs-ui"
import DividedLayout from "../../../../layouts/Divided"
import SectionContainer from "../../../Section/Container"
import useSchemaExample from "../../../../hooks/use-schema-example"
import { InView } from "react-intersection-observer"
import checkElementInViewport from "../../../../utils/check-element-in-viewport"
import { singular } from "pluralize"
import clsx from "clsx"
import { useArea } from "../../../../providers/area"
import { getSectionId } from "docs-utils"

export type TagSectionSchemaProps = {
  schema: OpenAPI.SchemaObject
  tagName: string
}

const TagSectionSchema = ({ schema, tagName }: TagSectionSchemaProps) => {
  const { setActivePath, activePath } = useSidebar()
  const { displayedArea } = useArea()
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
        // @ts-expect-error Type is being read as undefined
        as="div"
        id={schemaSlug}
        initialInView={true}
        onChange={handleViewChange}
        root={root}
        threshold={0.1}
      >
        <SectionContainer>
          <DividedLayout
            mainContent={
              <div>
                <h2>{formattedName} Object</h2>
                <Note>
                  This object&apos;s schema is as returned by Medusa&apos;s{" "}
                  {displayedArea} API routes. However, the related model in the
                  Medusa application may support more fields and relations. To
                  view the models in the Medusa application and their relations,
                  visit the{" "}
                  <Link
                    href="https://docs.medusajs.com/resources/commerce-modules"
                    variant="content"
                  >
                    Commerce Modules Documentation
                  </Link>
                </Note>
                <h4 className="border-medusa-border-base border-b py-1.5 mt-2">
                  Fields
                </h4>
                <TagOperationParameters schemaObject={schema} topLevel={true} />
              </div>
            }
            codeContent={
              <>
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
              </>
            }
          />
        </SectionContainer>
      </InView>
    </Suspense>
  )
}

export default TagSectionSchema
