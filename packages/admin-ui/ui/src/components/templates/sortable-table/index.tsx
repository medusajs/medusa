import { FC, HTMLAttributes, PropsWithChildren } from "react"
import Button from "../../fundamentals/button"
import GripIcon from "../../fundamentals/icons/grip-icon"
import Table from "../../molecules/table"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
  SortableItemProps,
  SortableProps,
} from "../sortable"

export type SortableTableProps = SortableProps

export interface SortableTableRowProps extends SortableItemProps {}

export const SortableTable: FC<PropsWithChildren<SortableTableProps>> = ({
  children,
  ...props
}) => (
  <Sortable {...props}>
    <Table containerClassName="mb-0">{children}</Table>
  </Sortable>
)

export const SortableTableRow: FC<PropsWithChildren<SortableTableRowProps>> = ({
  children,
  ...props
}) => (
  <SortableItem {...props} handle={true} as={Table.Row}>
    <Table.Cell className="medium:w-[72px] small:w-auto">
      <div className="p-xsmall leading-none">
        <SortableItemHandle>
          <Button
            variant="ghost"
            size="small"
            className="w-6 h-6 cursor-grab active:cursor-grabbing text-grey-40 !p-0"
          >
            <span>
              <GripIcon className="w-5 h-5" />
            </span>
          </Button>
        </SortableItemHandle>
      </div>
    </Table.Cell>
    {children}
  </SortableItem>
)

export const SortableTableHead: FC<
  PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>
> = ({ children, ...props }) => (
  <Table.Head {...props}>
    <Table.HeadRow>
      <Table.HeadCell className="w-[6%]" />
      {children}
    </Table.HeadRow>
  </Table.Head>
)
