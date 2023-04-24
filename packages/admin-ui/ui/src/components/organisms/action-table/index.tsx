import { FC, useCallback, useMemo, useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import clsx from "clsx"
import { DragEndEvent } from "@dnd-kit/core"
import Select from "../../molecules/select/next-select/select"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Input from "../../../components/molecules/input"
import Checkbox from "../../../components/atoms/checkbox"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "../../templates/sortable"
import GripIcon from "../../fundamentals/icons/grip-icon"
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid"
import UnfoldLessIcon from "../../fundamentals/icons/unfold-less"
import UnfoldMoreIcon from "../../fundamentals/icons/unfold-more"
import Tooltip from "../../atoms/tooltip"

export interface ActionTableProps {
  name: string
  label?: string
  translatable?: boolean
  stylable?: boolean
  showHead?: boolean
  max?: number
  narrow?: boolean
  className?: string
}

const ActionTable: FC<ActionTableProps> = ({
  name,
  label = "Actions",
  translatable,
  stylable,
  max,
  narrow = false,
  className,
}) => {
  const { control, setValue } = useFormContext()
  const {
    fields: items,
    append,
    remove,
    move,
  } = useFieldArray({ control, name })
  const [isCollapsed, setIsCollapsed] = useState(false)

  const emptyNavItem = useMemo(() => {
    const initialEmptyNavItem = {
      label: translatable ? { value: "" } : "",
      url: translatable ? { value: "" } : "",
      new_tab: false,
    }

    if (stylable) initialEmptyNavItem["style_variant"] = "default"

    return initialEmptyNavItem
  }, [translatable, stylable])

  const addItem = useCallback(
    () => append(emptyNavItem),
    [emptyNavItem, append]
  )

  const removeItem = useCallback((index) => remove(index), [remove])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over?.id) return
    if (active.id === over.id) return

    const oldIndex = items.findIndex((f) => f.id === active.id)
    const newIndex = items.findIndex((f) => f.id === over?.id)

    move(oldIndex, newIndex)
  }

  const variantOptions = [
    {
      label: "Default",
      value: "default",
    },
    {
      label: "Primary",
      value: "primary",
    },
    {
      label: "Link",
      value: "link",
    },
  ]

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="inter-base-semibold">
          {label}

          {typeof max === "number" && (
            <span className="ml-1 inter-base-regular text-grey-50 text-xs">
              (limit {max})
            </span>
          )}
        </h3>

        {narrow && (
          <div className="flex items-center leading-none">
            <Tooltip side="left" content={isCollapsed ? "Expand" : "Collapse"}>
              <Button
                size="small"
                variant="ghost"
                className="w-6 h-6 text-grey-40 !p-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <span>
                  {!isCollapsed && <UnfoldLessIcon className="w-6 h-6" />}
                  {isCollapsed && <UnfoldMoreIcon className="w-6 h-6" />}
                </span>
              </Button>
            </Tooltip>
          </div>
        )}
      </div>

      {!!items.length && (
        <Sortable items={items} onDragEnd={handleDragEnd}>
          <div className="flex flex-col">
            <header
              className={clsx(
                "flex gap-2 inter-small-semibold text-grey-50 border-t border-b border-grey-20 -mt-[1px]",
                {
                  hidden: narrow,
                }
              )}
            >
              <div className="flex gap-2 h-[40px] grow-0 shrink-0">
                <div className="w-[24px]" />
              </div>

              <div className="flex items-center h-[40px] flex-1 min-w-0">
                <div className="w-full">Label</div>
              </div>

              <div className="flex items-center h-[40px] flex-1 min-w-0">
                <div className="w-full">URL</div>
              </div>

              {stylable && (
                <div className="flex items-center h-[40px] w-[20%] grow-0 shrink-0">
                  <div className="w-full">Button type</div>
                </div>
              )}

              <div className="flex items-center h-[40px] w-[72px] grow-0 shrink-0 text-center">
                <div className="w-full">New Tab</div>
              </div>

              <div className="flex items-center h-[40px] grow-0 shrink-0">
                <div className="w-[24px]" />
              </div>
            </header>

            <div>
              {items.map((item, index) => (
                <SortableItem
                  id={item.id}
                  key={item.id}
                  handle={true}
                  as="div"
                  tabIndex={-1}
                  className={({ isDragging }) =>
                    clsx(
                      "relative flex w-full inter-small-regular bg-white border-t border-b border-grey-20 -my-[1px] text-grey-90",
                      {
                        "items-center gap-2 py-2": !narrow,
                        "gap-3 py-3": narrow,
                        "items-start": narrow && !isCollapsed,
                        "items-center": narrow && isCollapsed,
                        "z-50": isDragging,
                      }
                    )
                  }
                >
                  <div
                    className={clsx("flex gap-2 grow-0 shrink-0 leading-none", {
                      "flex-col w-6": narrow,
                    })}
                  >
                    <div>
                      <SortableItemHandle>
                        <Button
                          size="small"
                          variant="ghost"
                          className="w-6 h-6 cursor-grab active:cursor-grabbing text-grey-40 !p-0"
                          tabIndex={-1}
                        >
                          <GripIcon className="w-5 h-5" />
                        </Button>
                      </SortableItemHandle>
                    </div>

                    {narrow && !isCollapsed && (
                      <>
                        <div>
                          <Button
                            size="small"
                            variant="ghost"
                            className="w-6 h-6 text-grey-40 !p-0"
                            onClick={() => move(index, index - 1)}
                            disabled={index === 0}
                          >
                            <ArrowUpIcon className="w-5 h-5" />
                          </Button>
                        </div>

                        <div>
                          <Button
                            size="small"
                            variant="ghost"
                            className="w-6 h-6 text-grey-40 !p-0"
                            onClick={() => move(index, index + 1)}
                            disabled={index === items.length - 1}
                          >
                            <ArrowDownIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    className={clsx("flex-1 flex items-center", {
                      "gap-2": !narrow,
                      "gap-3 flex-col": narrow,
                    })}
                  >
                    <div
                      className={clsx(
                        "flex-1 min-w-0 flex items-center gap-2",
                        {
                          "w-full": narrow,
                        }
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <Controller
                          control={control}
                          name={`${name}.${index}.label${
                            translatable ? ".value" : ""
                          }`}
                          render={({ field }) => (
                            <Input
                              label={narrow && !isCollapsed ? "Label" : ""}
                              placeholder="Enter a label"
                              className="text-base"
                              {...field}
                            />
                          )}
                        />
                      </div>

                      {isCollapsed && (
                        <div
                          className={clsx(
                            "grow-0 shrink-0 text-right w-[32px]"
                          )}
                        >
                          <Button
                            variant="ghost"
                            size="small"
                            className="inline-block p-1 text-grey-40 cursor-pointer"
                          >
                            <TrashIcon
                              className="w-5 h-5"
                              onClick={() => removeItem(index)}
                            />
                          </Button>
                        </div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <>
                        <div
                          className={clsx("flex-1 min-w-0", {
                            "w-full": narrow,
                          })}
                        >
                          <Controller
                            control={control}
                            name={`${name}.${index}.url${
                              translatable ? ".value" : ""
                            }`}
                            render={({ field }) => (
                              <Input
                                label={narrow ? "URL" : ""}
                                placeholder="Enter a URL or relative path"
                                className="text-base"
                                {...field}
                              />
                            )}
                          />
                        </div>

                        {stylable && (
                          <div
                            className={clsx("grow-0 shrink-0", {
                              "w-[20%]": !narrow,
                              "w-full": narrow,
                            })}
                          >
                            <Controller
                              control={control}
                              name={`${name}.${index}.style_variant`}
                              render={({ field: { value, onBlur } }) => (
                                <Select
                                  label={narrow ? "Button type" : ""}
                                  placeholder="Select a button type"
                                  isMulti={false}
                                  options={variantOptions}
                                  onBlur={onBlur}
                                  value={variantOptions.find(
                                    (option) => option.value === value
                                  )}
                                  onChange={(value) =>
                                    setValue(
                                      `${name}.${index}.style_variant`,
                                      value?.value || "default"
                                    )
                                  }
                                />
                              )}
                            />
                          </div>
                        )}

                        <div
                          className={clsx("flex items-center grow-0 shrink-0", {
                            "w-full": narrow,
                          })}
                        >
                          <div
                            className={clsx("grow-0 shrink-0 leading-none", {
                              "w-[72px] text-center": !narrow,
                              "w-1/2 text-left": narrow,
                            })}
                          >
                            <Controller
                              control={control}
                              name={`${name}.${index}.new_tab`}
                              render={({
                                field: { onChange, onBlur, value },
                              }) => (
                                <Checkbox
                                  className="!inline-flex"
                                  label={narrow ? "New Tab" : ""}
                                  onChange={(e) => onChange(e.target.checked)}
                                  onBlur={onBlur}
                                  checked={value}
                                />
                              )}
                            />
                          </div>

                          <div
                            className={clsx("grow-0 shrink-0 text-right", {
                              "w-[24px]": !narrow,
                              "w-1/2": narrow,
                            })}
                          >
                            <Button
                              variant="ghost"
                              size="small"
                              className="inline-block p-1 text-grey-40 cursor-pointer"
                            >
                              <TrashIcon
                                size={20}
                                onClick={() => removeItem(index)}
                              />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SortableItem>
              ))}
            </div>
          </div>
        </Sortable>
      )}

      {(typeof max !== "number" || items.length < max) && (
        <div className={clsx("flex items-center justify-start")}>
          <Button variant="secondary" size="small" onClick={addItem}>
            <PlusIcon size={20} />
            Add item
          </Button>
        </div>
      )}
    </div>
  )
}

export default ActionTable
