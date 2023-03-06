import * as Collapsible from "@radix-ui/react-collapsible"
import clsx from "clsx"
import { useMemo, useState } from "react"
import { JSONTree } from "react-json-tree"
import useClipboard from "../../../hooks/use-clipboard"
import Button from "../../fundamentals/button"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import ClipboardCopyIcon from "../../fundamentals/icons/clipboard-copy-icon"

type JSONViewProps = {
  data: object
}

const JSONView = ({ data }: JSONViewProps) => {
  const [expanded, setExpanded] = useState(false)
  const [isCopied, handleCopy] = useClipboard(
    JSON.stringify(data, undefined, 2),
    {
      successDuration: 5500,
      onCopied: () => {},
    }
  )

  const length = useMemo(() => {
    return Object.keys(data).length
  }, [data])

  return (
    <div className="px-base py-xsmall rounded-rounded bg-grey-5 w-full">
      <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
        <Collapsible.Trigger asChild>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-x-xsmall inter-base-regular">
              <p className="inter-base-semibold">
                {expanded ? "{" : length > 0 ? "{ ... }" : "{}"}
              </p>
              <span className="text-grey-50">
                ({length} {length === 1 ? "item" : "items"})
              </span>
            </div>
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
            <JSONTree
              data={data}
              hideRoot
              theme={{
                base00: "#F9FAFB", // bg
                base08: "#e53935", // null
                base09: "#fb8c00", // boolean && numbers
                base0B: "#0D9488", // string
                base0D: "#4F46E5", // key
                extend: {
                  background: "#F9FAFB",
                },
              }}
              shouldExpandNode={() => false}
            />
          </div>
          <div className="flex items-center justify-between w-full">
            {expanded && <p className="inter-base-semibold">{`}`}</p>}
            <div className="flex items-center gap-x-xsmall text-grey-50 inter-small-regular">
              {isCopied && (
                <span className="animate-fade-in-right">Copied!</span>
              )}
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
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

export default JSONView
