"use client"

import React from "react"
import { Suspense, useMemo } from "react"
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
import { singular } from "pluralize"
import clsx from "clsx"
import { useArea } from "../../../../providers/area"
import { getApiRefTagSlug } from "docs-utils"
import basePathUrl from "../../../../utils/base-path-url"
import ViewAsMarkdown from "@/components/ViewAsMarkdown"
import {
  isScrollSpyLocked,
  markScrollSpyNavigation,
  scheduleScrollSpyUpdate,
} from "@/utils/scroll-spy-lock"

export type TagSectionSchemaProps = {
  schema: OpenAPI.SchemaObject
  tagName: string
}

const SCHEMA_DOM_ID = "schema"

const TagSectionSchema = ({ schema, tagName }: TagSectionSchemaProps) => {
  const { setActivePath, activePath } = useSidebar()
  const { area, displayedArea } = useArea()
  const formattedName = useMemo(
    () => singular(tagName).replaceAll(" ", ""),
    [tagName]
  )
  const schemaPath = useMemo(
    () => `/${area}/${getApiRefTagSlug(tagName)}/${SCHEMA_DOM_ID}`,
    [area, tagName]
  )
  const { examples } = useSchemaExample({
    schema,
    options: {
      skipNonRequired: false,
    },
  })
  const { isBrowser } = useIsBrowser()

  const { scrollableElement } = useScrollController()
  const root = useMemo(() => {
    if (!isBrowser) {
      return
    }

    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [isBrowser, scrollableElement])

  // Scroll-spy only: reflect the schema in the URL/highlight when it's at the
  // top. Suppressed while a deep-link scroll is settling (see scroll-spy-lock);
  // scrolling to the schema on navigation is handled by TagSection.
  const handleViewChange = (inView: boolean) => {
    if (!isBrowser || isScrollSpyLocked() || !inView) {
      return
    }
    if (activePath !== schemaPath) {
      // debounced so fast scrolling applies a single update once it settles
      scheduleScrollSpyUpdate(() => {
        if (isScrollSpyLocked()) {
          return
        }
        setActivePath(schemaPath)
        markScrollSpyNavigation(schemaPath)
        history.replaceState(null, "", basePathUrl(schemaPath))
      })
    }
  }

  return (
    <Suspense>
      <InView
        // @ts-expect-error Type is being read as undefined
        as="div"
        id={SCHEMA_DOM_ID}
        onChange={handleViewChange}
        root={root}
        threshold={0}
        rootMargin={`-112px 0px -80% 0px`}
      >
        <SectionContainer>
          <DividedLayout
            mainContent={
              <div>
                <h2>{formattedName} Object</h2>
                <ViewAsMarkdown path={schemaPath} className="mb-1" />
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
