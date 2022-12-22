import * as Collapsible from "@radix-ui/react-collapsible"
import { JsonViewer } from "@textea/json-viewer"
import clsx from "clsx"
import React, { useState } from "react"
import useClipboard from "../../../hooks/use-clipboard"
import Button from "../../fundamentals/button"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import ClipboardCopyIcon from "../../fundamentals/icons/clipboard-copy-icon"

type ViewRawProps = {
  raw: object
  title?: string
  name?: string
}

const ViewRaw: React.FC<ViewRawProps> = ({ raw, title = "Data", name }) => {
  const [expanded, setExpanded] = useState(false)
  const [isCopied, handleCopy] = useClipboard(
    JSON.stringify(raw, undefined, 2),
    {
      successDuration: 5500,
      onCopied: () => {},
    }
  )

  return (
    <div className="px-base py-xsmall rounded-rounded bg-grey-5">
      <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
        <Collapsible.Trigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <p className="inter-base-semibold">
              {title}{" "}
              <span className="inter-base-regular text-grey-50">
                ({Object.keys(raw).length}{" "}
                {Object.keys(raw).length === 1 ? "item" : "items"})
              </span>
            </p>
            <Button variant="ghost" size="small" className="text-grey-50">
              <ChevronDownIcon
                size={20}
                className={clsx("text-grey-50", {
                  "rotate-180": expanded,
                })}
              />
            </Button>
          </div>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="mt-xsmall">
            <JsonViewer
              value={raw}
              rootName={name}
              style={{
                fontFamily: "Roboto Mono",
                fontSize: "12px",
              }}
              enableClipboard={false}
            />
          </div>
          <div className="flex items-center justify-end w-full gap-x-xsmall text-grey-50 inter-small-regular">
            {isCopied && <span className="animate-fade-in-right">Copied!</span>}
            <Button
              variant="ghost"
              size="small"
              type="button"
              onClick={(e) => {
                e.currentTarget.blur()
                handleCopy()
              }}
            >
              <ClipboardCopyIcon size={20} />
            </Button>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export default ViewRaw
