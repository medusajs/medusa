import { PostSection } from "@medusajs/medusa"
import clsx from "clsx"
import { FC, RefObject, useEffect, useRef, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import Tooltip from "../../../../../../components/atoms/tooltip"
import Badge from "../../../../../../components/fundamentals/badge"
import Button from "../../../../../../components/fundamentals/button"
import CheckIcon from "../../../../../../components/fundamentals/icons/check-icon"
import CrossIcon from "../../../../../../components/fundamentals/icons/cross-icon"
import LibraryIcon from "../../../../../../components/fundamentals/icons/library"
import LibraryAddIcon from "../../../../../../components/fundamentals/icons/library-add"
import Alert from "../../../../../../components/molecules/alert"
import Input from "../../../../../../components/molecules/input"
import Modal, {
  ModalProps,
  PointerDownOutsideEvent,
} from "../../../../../../components/molecules/modal"
import { NextSelect as Select } from "../../../../../../components/molecules/select/next-select"
import { TablePagination as Pagination } from "../../../../../../components/organisms/table-container/pagination"
import { useGetPostSections } from "../../../../../../hooks/admin/post-sections"
import { useDebounce } from "../../../../../../hooks/use-debounce"
import { PostSectionStatus } from "../../../../../../types/shared"
import { getSectionTypeLabel } from "../helpers/get-section-type-label"
import { getSectionTypeOptions } from "../helpers/get-section-type-options"
import { usePostContext } from "../../../../context"

export interface PostSectionLibraryModalProps
  extends Omit<ModalProps, "handleClose"> {
  onSubmit: (selected: PostSection[]) => void
  onClose: () => void
}

export const PostSectionLibraryModal: FC<PostSectionLibraryModalProps> = ({
  onClose,
  onSubmit,
  ...props
}) => {
  const { featureFlags } = usePostContext()
  const modalContentRef = useRef<HTMLDivElement>(null)
  const defaultValues = { q: "", type: "any" }
  const PAGE_SIZE = 24
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState<PostSection[]>([])
  const formMethods = useForm({ defaultValues })
  const filterQuery = formMethods.watch("q")
  const filterType = formMethods.watch("type")
  const debouncedSearchTerm = useDebounce(filterQuery, 500)

  const {
    post_sections: postSections,
    count,
    isLoading,
  } = useGetPostSections(
    {
      q: debouncedSearchTerm,
      type: filterType === "any" ? undefined : filterType,
      is_reusable: true,
      limit: PAGE_SIZE,
      offset,
    },
    { refetchOnMount: "always" }
  )

  const filterTypeOptions = [
    { label: "Any", value: "any" },
    ...getSectionTypeOptions(featureFlags),
  ]

  const hasNoSections =
    !filterQuery && filterType === "any" && !postSections?.length

  const clearSelected = () => {
    setSelected([])
  }

  const toggleSelected = (section: PostSection) => {
    const existing = selected.find((s) => s.id === section.id)

    if (existing) {
      setSelected(selected.filter((s) => s.id !== existing.id))
    } else {
      setSelected([...selected, section])
    }
  }

  const resetScroll = () => {
    if (modalContentRef.current) modalContentRef.current.scrollTop = 0
  }

  const handleClose = () => {
    formMethods.reset(defaultValues)
    clearSelected()
    if (onClose) onClose()
  }

  const handleSubmit = async () => {
    if (onSubmit) await onSubmit(selected)
    handleClose()
  }

  const handleNext = () => {
    setOffset((old) => old + PAGE_SIZE)
    setCurrentPage((old) => old + 1)
    resetScroll()
  }

  const handlePrev = () => {
    setOffset((old) => old - PAGE_SIZE)
    setCurrentPage((old) => old - 1)
    resetScroll()
  }

  const handlePointerDownOutside = (event: PointerDownOutsideEvent) => {
    if (selected.length > 0) event.preventDefault()
  }

  useEffect(() => {
    setOffset(0)
    setCurrentPage(1)
  }, [filterType, filterQuery])

  return (
    <Modal
      {...props}
      handleClose={handleClose}
      onPointerDownOutside={handlePointerDownOutside}
      className="h-full"
    >
      <Modal.Body className="flex flex-col">
        <Modal.Header
          handleClose={handleClose}
          className="border-b border-grey-20"
        >
          <div className="flex gap-3 items-center pb-4">
            <h3 className="inter-xlarge-semibold">Add existing section</h3>
            <div>
              {selected.length > 0 && (
                <Button
                  variant="ghost"
                  className="!p-0 leading-none"
                  onClick={clearSelected}
                >
                  <Badge
                    variant="primary"
                    className="inline-flex gap-1 items-center"
                  >
                    <span>{selected.length} selected</span>
                    <span>
                      <CrossIcon className="w-4 h-4" />
                    </span>
                  </Badge>
                </Button>
              )}
            </div>
          </div>

          {!hasNoSections && (
            <FormProvider {...formMethods}>
              <div className="grid grid-cols-12 gap-4 pb-4">
                <div className="col-span-3">
                  <Controller
                    name="type"
                    control={formMethods.control}
                    render={({ field: { value, onBlur } }) => (
                      <Select
                        isMulti={false}
                        options={filterTypeOptions}
                        onBlur={onBlur}
                        value={filterTypeOptions.find(
                          (option) => option.value === value
                        )}
                        onChange={(value) => {
                          formMethods.setValue(
                            "type",
                            value?.value || defaultValues.type
                          )
                        }}
                      />
                    )}
                  ></Controller>
                </div>
                <div className="col-span-9">
                  <Input
                    type="search"
                    placeholder="Type to search for sections"
                    {...formMethods.register("q")}
                  />
                </div>
              </div>
            </FormProvider>
          )}
        </Modal.Header>

        <Modal.Content
          ref={modalContentRef as RefObject<HTMLDivElement>}
          className="flex-1 !py-6"
        >
          <div className="flex flex-col gap-2">
            {hasNoSections && (
              <Alert
                icon={LibraryIcon}
                variant="primary"
                title="No library sections added"
              >
                It looks like you haven't yet added any sections to the section
                library. To add a section to the library, click the
                <span className="inline-flex items-center gap-1 mx-2 align-bottom font-semibold">
                  <LibraryAddIcon className="w-4 h-4" /> Add to Library
                </span>
                option when editing a section.
              </Alert>
            )}

            {postSections?.map((postSection) => {
              const isSelected = !!selected.find((s) => s.id === postSection.id)
              const usageCount = postSection.usage_count || 0

              return (
                <button
                  key={postSection.id}
                  className={clsx(
                    `py-4 px-5 w-full flex gap-5 items-center text-left border border-grey-20 rounded-rounded focus:outline-none focus:shadow-cta hover:bg-grey-5 active:bg-grey-5 active:text-violet-60 focus:border-violet-60 group`,
                    {
                      "!bg-violet-5 border-violet-60": isSelected,
                    }
                  )}
                  onClick={() => toggleSelected(postSection)}
                >
                  <div>
                    <div
                      className={clsx(
                        "flex flex-shrink-0 flex-grow-0 items-center justify-center w-5 h-5 rounded-base text-white bg-grey-10 group-hover:bg-grey-20",
                        { "!bg-violet-50": isSelected }
                      )}
                    >
                      {isSelected && <CheckIcon className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="max-w-[60%]">
                    <div className="inter-small-regular text-grey-50">
                      {getSectionTypeLabel(postSection.type)}
                    </div>
                    <h3 className="inter-large-semibold w-full truncate">
                      {postSection.name || "Untitled"}
                    </h3>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <div>
                      <Tooltip
                        sideOffset={4}
                        className="!max-w-[160px]"
                        content={
                          <>
                            This library section is{" "}
                            {!usageCount && <>not in use.</>}
                            {!!usageCount && (
                              <>
                                used in{" "}
                                <span className="font-semibold">
                                  {usageCount}
                                </span>
                                &nbsp;location
                                {usageCount > 1 ? "s" : ""}.
                              </>
                            )}
                          </>
                        }
                      >
                        <Badge
                          variant="primary"
                          className="flex items-center gap-1 p-1 pl-1.5 pr-2"
                        >
                          <LibraryIcon className="w-4 h-4" /> {usageCount}
                        </Badge>
                      </Tooltip>
                    </div>
                    <div>
                      {postSection.status === PostSectionStatus.DRAFT && (
                        <Badge variant="warning">Draft</Badge>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Modal.Content>

        {!hasNoSections && (
          <Modal.Footer className="flex items-center justify-between gap-2">
            <div className="flex-1 pr-5 border-r border-grey-20">
              <Pagination
                isLoading={isLoading}
                pagingState={{
                  title: "Sections",
                  offset,
                  currentPage,
                  pageSize: PAGE_SIZE,
                  pageCount: count ? Math.ceil(count / PAGE_SIZE) : 0,
                  count: count || 0,
                  hasNext: count ? count > offset + PAGE_SIZE : false,
                  hasPrev: offset > 0,
                  prevPage: handlePrev,
                  nextPage: handleNext,
                }}
              />
            </div>

            <div className="flex gap-2 items-center">
              <Button variant="ghost" size="small" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleSubmit}
                disabled={!selected.length}
              >
                Insert sections
              </Button>
            </div>
          </Modal.Footer>
        )}
      </Modal.Body>
    </Modal>
  )
}
