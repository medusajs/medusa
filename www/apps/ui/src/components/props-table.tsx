"use client"

import { InformationCircleSolid } from "@medusajs/icons"
import { Table, Tooltip } from "@medusajs/ui"

import { PropData, PropDataMap, PropSpecType } from "@/types/props"
import { useCallback, useMemo } from "react"
import { InlineCode, MarkdownContent } from "docs-ui"

type PropTableProps = {
  props: PropDataMap
}

const PropTable = ({ props }: PropTableProps) => {
  return (
    <Table>
      <Table.Header className="border-t-0">
        <Table.Row>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell className="text-right">Default</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body className="border-b-0 [&_tr:last-child]:border-b-0">
        {Object.entries(props).map(([propName, propData]) => (
          <Row key={propName} propName={propName} propData={propData} />
        ))}
      </Table.Body>
    </Table>
  )
}

type RowProps = {
  propName: string
  propData: PropData
}

type TypeNode = {
  text: string
  tooltipContent?: string
  canBeCopied?: boolean
}

const Row = ({
  propName,
  propData: { tsType: tsType, defaultValue, description },
}: RowProps) => {
  const normalizeRaw = (str: string): string => {
    return str.replace("\\|", "|")
  }
  const getTypeRaw = useCallback((type: PropSpecType): string => {
    let raw = "raw" in type ? type.raw || type.name : type.name
    if ("type" in type) {
      if (type.type === "object") {
        raw = `{\n  ${type.signature.properties
          .map((property) => `${property.key}: ${property.value.name}`)
          .join("\n  ")}\n}`
      } else {
        raw = type.raw
      }
    } else if (type.name === "Array" && "elements" in type) {
      raw = type.elements.map((element) => getTypeRaw(element)).join(" | ")
    }

    return normalizeRaw(raw)
  }, [])
  const getTypeText = useCallback((type: PropSpecType): string => {
    if (type?.name === "signature" && "type" in type) {
      return type.type
    } else if (type?.name === "Array" && type.raw) {
      return normalizeRaw(type.raw) || "array"
    }

    return type.name || ""
  }, [])
  const getTypeTooltipContent = useCallback(
    (type: PropSpecType): string | undefined => {
      if (type?.name === "signature" && "type" in type) {
        return getTypeRaw(type)
      } else if (type?.name === "Array" && type.raw) {
        return getTypeRaw(type)
      }

      return undefined
    },
    [getTypeRaw]
  )

  const typeNodes = useMemo((): TypeNode[] => {
    const typeNodes: TypeNode[] = []
    if (tsType?.name === "union" && "elements" in tsType) {
      tsType.elements.forEach((element) => {
        if (
          ("elements" in element && element.elements.length) ||
          "signature" in element
        ) {
          const elementTypeText = getTypeText(element)
          const elementTooltipContent = getTypeTooltipContent(element)
          typeNodes.push({
            text: elementTypeText,
            tooltipContent:
              elementTypeText !== elementTooltipContent
                ? elementTooltipContent
                : undefined,
          })
        } else if ("value" in element) {
          typeNodes.push({
            text: element.value,
            canBeCopied: true,
          })
        } else {
          typeNodes.push({
            text: element.name,
          })
        }
      })
    } else if (tsType) {
      typeNodes.push({
        text: getTypeText(tsType),
        tooltipContent: getTypeTooltipContent(tsType),
      })
    }

    return typeNodes
  }, [tsType, getTypeText, getTypeTooltipContent])

  const defaultVal: string | undefined = defaultValue?.value as string

  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-x-1">
          <InlineCode>{propName}</InlineCode>
          {description && (
            <Tooltip
              content={
                <MarkdownContent
                  allowedElements={["a", "code"]}
                  unwrapDisallowed={true}
                >
                  {description}
                </MarkdownContent>
              }
            >
              <InformationCircleSolid className="text-medusa-fg-subtle" />
            </Tooltip>
          )}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center flex-wrap gap-1 py-1">
          {typeNodes.map((typeNode, index) => (
            <div key={index} className="flex items-center gap-x-1">
              {index > 0 && <span>|</span>}
              {typeNode.tooltipContent && (
                <Tooltip
                  content={<pre>{typeNode.tooltipContent}</pre>}
                  className="font-mono !max-w-none"
                >
                  <div className="flex items-center gap-x-1">
                    <code>{typeNode.text}</code>
                    <InformationCircleSolid className="text-medusa-fg-subtle" />
                  </div>
                </Tooltip>
              )}
              {!typeNode.tooltipContent && (
                <>
                  {typeNode.canBeCopied && (
                    <InlineCode>{typeNode.text}</InlineCode>
                  )}
                  {!typeNode.canBeCopied && <code>{typeNode.text}</code>}
                </>
              )}
            </div>
          ))}
        </div>
      </Table.Cell>
      <Table.Cell className="text-right">
        {defaultVal && <InlineCode>{defaultVal}</InlineCode>}
        {!defaultVal && " - "}
      </Table.Cell>
    </Table.Row>
  )
}

export { PropTable }
