import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import React from "react"
import { useFieldArray, useWatch } from "react-hook-form"
import { NestedForm } from "../../../utils/nested-form"
import Button from "../../fundamentals/button"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ArrowUpIcon from "../../fundamentals/icons/arrow-up-icon"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EllipsisVerticalIcon from "../../fundamentals/icons/ellipsis-vertical-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"

type ValueType = "string" | "number" | "boolean" | "object"

export type MetadataField = {
  key: string
  value: unknown
  state?: "existing" | "deleted"
}

export type MetadataFormType = {
  metadata: MetadataField[]
}

type MetadataProps = {
  form: NestedForm<MetadataFormType>
}

export const Metadata = ({ form }: MetadataProps) => {
  const { control, path, register, setValue } = form

  const { fields, remove, insert } = useFieldArray({
    control,
    name: path("metadata"),
    keyName: "fieldKey",
  })

  const arr = useWatch({
    control,
    name: path("metadata"),
  })

  const handleInsertAbove = (index: number) => {
    insert(index, { key: "", value: "" })
  }

  const handleInsertBelow = (index: number) => {
    insert(index + 1, { key: "", value: "" })
    console.log("insert below")
  }

  const handleDelete = (index: number) => {
    const state = fields[index].state

    if (!state) {
      remove(index)
      return
    }

    setValue(path(`metadata.${index}.state`), "deleted")
    setValue(path(`metadata.${index}.value`), "")
  }

  const handleDuplicate = (index: number) => {
    insert(index + 1, { ...fields[index], state: undefined })
  }

  const handleClearContents = (index: number) => {
    setValue(path(`metadata.${index}.value`), "")
    setValue(path(`metadata.${index}.key`), "")
  }

  const rowClasses =
    "divide-grey-20 grid grid-cols-[165px_1fr] divide-x divide-solid [&>div]:px-base [&>div]:py-xsmall"

  return (
    <>
      <div className="rounded-rounded border-grey-20 divide-grey-20 inter-base-regular divide-y border">
        <div className={clsx("bg-grey-5 rounded-t-rounded", rowClasses)}>
          <div className="">
            <p>Key</p>
          </div>
          <div className="">
            <p>Value</p>
          </div>
        </div>
        <div className="divide-grey-20 divide-y">
          {!fields?.length ? (
            <MetadataRow
              onClearContents={() => handleClearContents(0)}
              onDelete={() => handleDelete(0)}
              onDuplicate={() => handleDuplicate(0)}
              onInsertAbove={() => handleInsertAbove(0)}
              onInsertBelow={() => handleInsertBelow(0)}
              isPlaceholder={true}
            >
              <div>
                <MetadataInput
                  {...register(path(`metadata.${0}.key`))}
                  placeholder="Key"
                />
              </div>
              <div>
                <MetadataInput
                  {...register(path(`metadata.${0}.value`))}
                  placeholder="Value"
                />
              </div>
            </MetadataRow>
          ) : (
            fields.map((field, index) => {
              return (
                <MetadataRow
                  key={field.fieldKey}
                  onClearContents={() => handleClearContents(index)}
                  onDelete={() => handleDelete(index)}
                  onDuplicate={() => handleDuplicate(index)}
                  onInsertAbove={() => handleInsertAbove(index)}
                  onInsertBelow={() => handleInsertBelow(index)}
                >
                  <div>
                    <MetadataInput
                      {...register(path(`metadata.${index}.key`))}
                      placeholder="Key"
                    />
                  </div>
                  <div>
                    <MetadataInput
                      {...register(path(`metadata.${index}.value`))}
                      placeholder="Value"
                    />
                  </div>
                </MetadataRow>
              )
            })
          )}
        </div>
      </div>
      <div>
        <pre>{JSON.stringify(arr, null, 2)}</pre>
      </div>
    </>
  )
}

const MetadataInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "placeholder:text-grey-40 placeholder:inter-base-regular w-full appearance-none outline-none",
        className
      )}
      {...props}
    />
  )
})

MetadataInput.displayName = "MetadataInput"

type MetadataRowProps = React.PropsWithChildren<{
  onDuplicate: () => void
  onInsertAbove: () => void
  onInsertBelow: () => void
  onDelete: () => void
  onClearContents: () => void
  isPlaceholder?: boolean
}>

const MetadataRow = ({
  onDuplicate,
  onInsertAbove,
  onInsertBelow,
  onDelete,
  onClearContents,
  isPlaceholder = false,
  children,
}: MetadataRowProps) => {
  const itemClasses =
    "px-base py-[6px] outline-none flex items-center gap-x-xsmall hover:bg-grey-5 focus:bg-grey-10 transition-colors cursor-pointer"

  return (
    <div className="last-of-type:rounded-b-rounded group relative">
      <div className="divide-grey-20 [&>div]:px-base [&>div]:py-xsmall grid grid-cols-[165px_1fr] divide-x divide-solid">
        {children}
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="secondary"
            size="small"
            className={clsx(
              "h-xlarge w-large -right-small radix-state-open:opacity-100 absolute inset-y-1/2 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100"
            )}
          >
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content asChild sideOffset={8}>
          <div className="bg-grey-0 shadow-dropdown border-grey-20 rounded-rounded z-50 overflow-hidden border">
            <DropdownMenu.Item onClick={onInsertAbove} className={itemClasses}>
              <ArrowUpIcon size={20} />
              <span>Insert above</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={onInsertBelow} className={itemClasses}>
              <ArrowDownIcon size={20} />
              <span>Insert below</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={onDuplicate} className={itemClasses}>
              <DuplicateIcon size={20} />
              <span>Duplicate</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={onClearContents}
              className={itemClasses}
            >
              <XCircleIcon size={20} />
              <span>Clear contents</span>
            </DropdownMenu.Item>
            <DropdownMenu.DropdownMenuSeparator className="bg-grey-20 h-px w-full" />
            <DropdownMenu.Item
              onClick={onDelete}
              disabled={isPlaceholder}
              className={clsx(
                "disabled:text-grey-50 text-rose-50",
                itemClasses
              )}
            >
              <TrashIcon size={20} />
              <span>Delete</span>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}
