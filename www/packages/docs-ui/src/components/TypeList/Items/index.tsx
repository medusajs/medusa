"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Details } from "@/components/Details"
import { CopyButton } from "@/components/CopyButton"
import { DetailsSummary } from "@/components/Details/Summary"
import { ExpandableNotice } from "@/components/Notices/ExpandableNotice"
import { FeatureFlagNotice } from "@/components/Notices/FeatureFlagNotice"
import { InlineCode } from "@/components/InlineCode"
import { MarkdownContent } from "@/components/MarkdownContent"
import { MDXComponents } from "@/components/MDXComponents"
import clsx from "clsx"
import { Type, CommonProps as ParentCommonProps } from ".."
import {
  ArrowDownLeftMini,
  ArrowsPointingOutMini,
  FlagMini,
  Link,
  TriangleRightMini,
} from "@medusajs/icons"
import { decodeStr } from "@/utils/decode-str"
import { isInView } from "@/utils/is-in-view"
import { usePathname } from "next/navigation"
import { useSiteConfig } from "../../../providers/SiteConfig"
import { useIsBrowser } from "../../../providers/BrowserProvider"
import { VersionNotice } from "../../Notices/VersionNotice"
import { DeprecatedNotice } from "../../Notices/DeprecatedNotice"

type CommonProps = ParentCommonProps & {
  level?: number
  referenceType?: "method" | "workflow"
}

type TypeListItemProps = {
  typeItem: Type
  elementKey: number
} & CommonProps &
  React.AllHTMLAttributes<HTMLDivElement>

const TypeListItem = ({
  typeItem,
  level = 1,
  expandUrl,
  elementKey,
  sectionTitle,
  referenceType = "method",
  openedLevel = 0,
}: TypeListItemProps) => {
  const { isBrowser } = useIsBrowser()
  const pathname = usePathname()
  const {
    config: { baseUrl, basePath },
  } = useSiteConfig()
  const siteUrl = `${baseUrl}${basePath}`

  const groupName = useMemo(() => {
    switch (level) {
      case 1:
        return "group/typeOne"
      case 2:
        return "group/typeTwo"
      case 3:
        return "group/typeThree"
      case 4:
        return "group/typeFour"
    }
  }, [level])
  const borderForGroupName = useMemo(() => {
    switch (level) {
      case 1:
        return "group-open/typeOne:border-solid group-open/typeOne:border-0 group-open/typeOne:border-b"
      case 2:
        return "group-open/typeTwo:border-solid group-open/typeTwo:border-0 group-open/typeTwo:border-b"
      case 3:
        return "group-open/typeThree:border-solid group-open/typeThree:border-0 group-open/typeThree:border-b"
      case 4:
        return "group-open/typeFour:border-solid group-open/typeFour:border-0 group-open/typeFour:border-b"
    }
  }, [level])
  const rotateForGroupName = useMemo(() => {
    switch (level) {
      case 1:
        return "group-open/typeOne:rotate-90"
      case 2:
        return "group-open/typeTwo:rotate-90"
      case 3:
        return "group-open/typeThree:rotate-90"
      case 4:
        return "group-open/typeFour:rotate-90"
    }
  }, [level])
  function getItemClassNames(details = true) {
    return clsx(
      "odd:[&:not(:first-child):not(:last-child)]:!border-y last:not(:first-child):!border-t",
      "first:!border-t-0 first:not(:last-child):!border-b last:!border-b-0 even:!border-y-0",
      details && groupName,
      !details && borderForGroupName
    )
  }
  const formatId = (str: string) => {
    return str.replaceAll(" ", "_")
  }
  const typeId = useMemo(() => {
    return sectionTitle
      ? `#${formatId(sectionTitle)}-${formatId(
          typeItem.name
        )}-${level}-${elementKey}`
      : ""
  }, [sectionTitle, typeItem, elementKey])
  const typePath = useMemo(() => `${pathname}${typeId}`, [pathname, typeId])
  const typeUrl = useMemo(() => `${siteUrl}${typePath}`, [siteUrl, typePath])

  const ref = useRef<HTMLDivElement>(null)
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    if (!typeId.length || !isBrowser) {
      return
    }

    const shouldScroll = window.location.hash === typeId

    if (shouldScroll && !isSelected && ref.current && !isInView(ref.current)) {
      ref.current.scrollIntoView({
        block: "center",
      })
    }

    setIsSelected(shouldScroll)
  }, [typeId, isBrowser])

  function getSummary(item: Type, nested = true) {
    return (
      <DetailsSummary
        subtitle={
          item.description || item.defaultValue || item.example ? (
            <>
              {item.description && (
                <MarkdownContent
                  allowedElements={[
                    "a",
                    "strong",
                    "code",
                    "ul",
                    "ol",
                    "li",
                    "br",
                  ]}
                  unwrapDisallowed={true}
                  components={{
                    ...MDXComponents,
                    ol: (props: React.HTMLAttributes<HTMLElement>) => (
                      // @ts-expect-error Not recognized as a JSX element
                      <MDXComponents.ol
                        {...props}
                        className={clsx(props.className, "mt-docs_1.5")}
                      />
                    ),
                    li: (props: React.HTMLAttributes<HTMLElement>) => (
                      // @ts-expect-error Not recognized as a JSX element
                      <MDXComponents.li
                        {...props}
                        className={clsx(
                          props.className,
                          "!text-medusa-fg-subtle"
                        )}
                      />
                    ),
                  }}
                >
                  {item.description}
                </MarkdownContent>
              )}
              {item.defaultValue && (
                <p className="mt-0.5 mb-0">
                  Default: <InlineCode>{item.defaultValue}</InlineCode>
                </p>
              )}
              {item.example && (
                <div className="mt-0.5">
                  Example: <InlineCode>{item.example}</InlineCode>
                </div>
              )}
            </>
          ) : undefined
        }
        expandable={(item.children?.length || 0) > 0}
        hideExpandableIcon={true}
        className={clsx(
          getItemClassNames(false),
          "py-1 pr-1",
          level === 1 && "pl-1",
          level === 2 && "pl-3",
          level === 3 && "pl-[120px]",
          level === 4 && "pl-[160px]",
          !nested && "cursor-auto",
          isSelected && "animate-flash animate-bg-surface"
        )}
        onClick={(e) => {
          const targetElm = e.target as HTMLElement
          if (targetElm.tagName.toLowerCase() === "a") {
            window.location.href =
              targetElm.getAttribute("href") || window.location.href
            return
          }
        }}
        summaryRef={!nested ? ref : undefined}
        id={!nested && typeId ? typeId : ""}
      >
        <div className="flex gap-0.5">
          {nested && (
            <TriangleRightMini
              className={clsx(
                "text-medusa-fg-subtle transition-transform",
                rotateForGroupName
              )}
            />
          )}
          {!nested && level > 1 && (
            <ArrowDownLeftMini
              className={clsx("text-medusa-fg-subtle flip-y")}
            />
          )}
          {level === 1 && typeId.length > 0 && (
            <CopyButton
              text={typeUrl}
              onCopy={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <Link
                className={clsx(
                  "text-medusa-fg-interactive hover:text-medusa-fg-interactive-hover"
                )}
              />
            </CopyButton>
          )}
          <div className="flex gap-0.75 flex-wrap flex-1">
            <InlineCode data-testid="type-name">
              {decodeStr(item.name)}
            </InlineCode>
            <span
              className="font-monospace text-compact-small-plus text-medusa-fg-subtle"
              data-testid="type-type"
            >
              <MarkdownContent allowedElements={["a"]} unwrapDisallowed={true}>
                {item.type}
              </MarkdownContent>
            </span>
            {item.optional === true && (
              <span
                className={clsx(
                  "text-compact-x-small-plus",
                  "text-medusa-tag-blue-text"
                )}
                data-testid="type-optional"
              >
                Optional
              </span>
            )}
            {item.featureFlag && (
              <FeatureFlagNotice
                featureFlag={item.featureFlag}
                type="type"
                badgeClassName="!p-0 leading-none"
                badgeContent={
                  <FlagMini className="!text-medusa-tag-green-text" />
                }
              />
            )}
            {item.expandable && (
              <ExpandableNotice
                type={referenceType}
                link={expandUrl || "#"}
                badgeClassName="!p-docs_0.25 block leading-none"
                badgeContent={<ArrowsPointingOutMini />}
              />
            )}
            {item.since && (
              <VersionNotice
                version={item.since}
                badgeClassName="!p-0 leading-none"
              />
            )}
            {item.deprecated?.is_deprecated && (
              <DeprecatedNotice description={item.deprecated?.description} />
            )}
          </div>
        </div>
      </DetailsSummary>
    )
  }

  return (
    <>
      {(typeItem.children?.length || 0) > 0 && (
        <Details
          summaryElm={getSummary(typeItem)}
          className={clsx(getItemClassNames())}
          heightAnimation={true}
          id={typeId ? typeId : ""}
          openInitial={openedLevel >= level}
        >
          {typeItem.children && (
            <TypeListItems
              types={typeItem.children}
              level={level + 1}
              expandUrl={expandUrl}
            />
          )}
        </Details>
      )}
      {(typeItem.children?.length || 0) === 0 && getSummary(typeItem, false)}
    </>
  )
}

type TypeListItemsProps = {
  types: Type[]
} & CommonProps

const TypeListItems = ({ types, ...rest }: TypeListItemsProps) => {
  return (
    <div>
      {types.map((typeItem, key) => (
        <TypeListItem
          typeItem={typeItem}
          key={key}
          elementKey={key}
          {...rest}
        />
      ))}
    </div>
  )
}

export default TypeListItems
