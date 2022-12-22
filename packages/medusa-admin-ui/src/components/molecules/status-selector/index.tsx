import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React from "react"
import Button from "../../fundamentals/button"
import StatusIndicator from "../../fundamentals/status-indicator"

type StatusSelectorProps = {
  isDraft: boolean
  activeState: string
  draftState: string
  onChange: () => void
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  isDraft,
  draftState,
  activeState,
  onChange,
}) => {
  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="small">
            <StatusIndicator
              title={isDraft ? draftState : activeState}
              variant={isDraft ? "default" : "active"}
            />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          <DropdownMenu.Item>
            {
              <Button
                variant="ghost"
                size="small"
                className="w-full justify-start"
                onClick={onChange}
              >
                <StatusIndicator
                  title={!isDraft ? draftState : activeState}
                  variant={!isDraft ? "default" : "active"}
                />
              </Button>
            }
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default StatusSelector
