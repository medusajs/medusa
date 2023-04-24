import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React from "react"
import Button from "../../fundamentals/button"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import StatusIndicator from "../../fundamentals/status-indicator"

type ProductStatusSelectorProps = {
  status: string
  onChange: (status: string) => void
}

const variantSelector = (status: string) =>
  status === "draft"
    ? "default"
    : status === "published"
    ? "active"
    : status === "rejected"
    ? "danger"
    : "warning"

const ProductStatusSelector: React.FC<ProductStatusSelectorProps> = ({
  status,
  onChange,
}) => {
  const statuses = ["draft", "published", "proposed", "rejected"]
  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="small">
            <StatusIndicator title={status} variant={variantSelector(status)} />
            <ChevronDownIcon size={20} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          {statuses.map((status) => {
            return (
              <DropdownMenu.Item key={status}>
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full justify-start"
                  onClick={() => onChange(status)}
                >
                  <StatusIndicator
                    title={status}
                    variant={variantSelector(status)}
                  />
                </Button>
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default ProductStatusSelector
