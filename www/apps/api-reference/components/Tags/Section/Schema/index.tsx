import { useEffect, useMemo } from "react"
import { SchemaObject } from "../../../../types/openapi"
import TagOperationParameters from "../../Operation/Parameters"
import {
  Badge,
  CodeBlock,
  isElmWindow,
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

export type TagSectionSchemaProps = {
  schema: SchemaObject
  tagName: string
}

const TagSectionSchema = ({ schema, tagName }: TagSectionSchemaProps) => {
  const { addItems, setActivePath, activePath } = useSidebar()
  const tagSlugName = useMemo(() => getSectionId([tagName]), [tagName])
  const formattedName = useMemo(() => {
    if (!schema["x-schemaName"]) {
      return tagName.replaceAll(" ", "")
    }

    return schema["x-schemaName"]
      .replaceAll(/^(Admin|Store)/g, "")
      .replaceAll(/^Create/g, "")
  }, [schema, tagName])
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

  const { scrollableElement } = useScrollController()
  const root = useMemo(() => {
    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [scrollableElement])

  useEffect(() => {
    addItems(
      [
        {
          path: schemaSlug,
          title: `${formattedName} Object`,
          additionalElms: <Badge variant="neutral">Schema</Badge>,
          loaded: true,
        },
      ],
      {
        section: SidebarItemSections.BOTTOM,
        parent: {
          path: tagSlugName,
          changeLoaded: true,
        },
        indexPosition: 0,
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedName])

  useEffect(() => {
    if (schemaSlug === (activePath || location.hash.replace("#", ""))) {
      const elm = document.getElementById(schemaSlug)
      elm?.scrollIntoView({
        block: "center",
      })
    }
  }, [])

  const handleViewChange = (
    inView: boolean,
    entry: IntersectionObserverEntry
  ) => {
    const section = entry.target

    if (
      (inView || checkElementInViewport(section, 40)) &&
      activePath !== schemaSlug
    ) {
      // can't use next router as it doesn't support
      // changing url without scrolling
      history.pushState({}, "", `#${schemaSlug}`)
      setActivePath(schemaSlug)
    }
  }

  return (
    <InView
      as="div"
      id={schemaSlug}
      initialInView={false}
      onChange={handleViewChange}
      root={root}
      threshold={0.1}
    >
      <DividedLayout
        mainContent={
          <SectionContainer>
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
              />
            )}
          </SectionContainer>
        }
      />
    </InView>
  )
}

export default TagSectionSchema
