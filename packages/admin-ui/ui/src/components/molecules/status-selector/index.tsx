import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import React from "react"
import Button from "../../fundamentals/button"
import StatusIndicator from "../../fundamentals/status-indicator"
import i18n from "../../../i18n"

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
      <DropdownMenu.Root dir={i18n.dir()}>
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
          className="bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall z-30 min-w-[200px] border"
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
