import { InformationCircleSolid } from "@medusajs/icons"
import { Table, Tooltip } from "@medusajs/ui"

import { HookData, HookDataMap } from "@/types/hooks"
import { EnumType, FunctionType, ObjectType } from "@/types/props"
import { InlineCode } from "docs-ui"

const HookTable = ({ props }: { props: HookDataMap }) => {
  return (
    <Table>
      <Table.Header className="border-t-0">
        <Table.Row>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body className="border-b-0 [&_tr:last-child]:border-b-0">
        {/* eslint-disable-next-line react/prop-types */}
        {props.map((propData, index) => (
          <Row key={index} {...propData} />
        ))}
      </Table.Body>
    </Table>
  )
}

const Row = ({ value, type, description }: HookData) => {
  const isEnum = (t: unknown): t is EnumType => {
    return (t as EnumType).type !== undefined && (t as EnumType).type === "enum"
  }

  const isObject = (t: unknown): t is ObjectType => {
    return (
      (t as ObjectType).type !== undefined &&
      (t as ObjectType).type === "object"
    )
  }

  const isFunction = (t: unknown): t is FunctionType => {
    return (
      (t as FunctionType).type !== undefined &&
      (t as FunctionType).type === "function"
    )
  }

  const isComplexType = isEnum(type) || isObject(type) || isFunction(type)

  return (
    <Table.Row className="code-body">
      <Table.Cell>
        <InlineCode>{value}</InlineCode>
      </Table.Cell>
      <Table.Cell>
        {!isComplexType && type.toString()}
        {isEnum(type) && (
          <Tooltip
            content={type.values.map((v) => `"${v}"`).join(" | ")}
            className="font-mono"
          >
            <div className="flex items-center gap-x-1">
              <span>enum</span>
              <InformationCircleSolid className="text-medusa-fg-subtle" />
            </div>
          </Tooltip>
        )}
        {isObject(type) && (
          <Tooltip
            content={<pre>{type.shape}</pre>}
            className="font-mono"
            maxWidth={500}
          >
            <div className="flex items-center gap-x-1">
              <span>{type.name}</span>
              <InformationCircleSolid className="text-medusa-fg-subtle" />
            </div>
          </Tooltip>
        )}
        {isFunction(type) && (
          <Tooltip
            content={<pre>{type.signature}</pre>}
            className="font-mono"
            maxWidth={500}
          >
            <div className="flex items-center gap-x-1">
              <span>function</span>
              <InformationCircleSolid className="text-medusa-fg-subtle" />
            </div>
          </Tooltip>
        )}
      </Table.Cell>
      <Table.Cell>{description}</Table.Cell>
    </Table.Row>
  )
}

export { HookTable }
