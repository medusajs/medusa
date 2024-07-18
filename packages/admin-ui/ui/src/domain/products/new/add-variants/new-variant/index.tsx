import clsx from "clsx"
import type { Identifier, XYCoord } from "dnd-core"
import { useContext, useEffect, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Tooltip from "../../../../../components/atoms/tooltip"
import { CustomsFormType } from "../../../../../components/forms/product/customs-form"
import { DimensionsFormType } from "../../../../../components/forms/product/dimensions-form"
import CreateFlowVariantForm, {
  CreateFlowVariantFormType,
} from "../../../../../components/forms/product/variant-form/create-flow-variant-form"
import { VariantOptionValueType } from "../../../../../components/forms/product/variant-form/variant-select-options-form"
import Button from "../../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../../components/fundamentals/icons/check-circle-fill-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import GripIcon from "../../../../../components/fundamentals/icons/grip-icon"
import MoreHorizontalIcon from "../../../../../components/fundamentals/icons/more-horizontal-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../../../components/molecules/actionables"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import Modal from "../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import useImperativeDialog from "../../../../../hooks/use-imperative-dialog"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { DragItem } from "../../../../../types/shared"

const ItemTypes = {
  CARD: "card",
}

type Props = {
  id: string
  source: CreateFlowVariantFormType
  index: number
  save: (index: number, variant: CreateFlowVariantFormType) => boolean
  remove: (index: number) => void
  move: (dragIndex: number, hoverIndex: number) => void
  options: VariantOptionValueType[]
  onCreateOption: (optionId: string, value: string) => void
  productDimensions: DimensionsFormType
  productCustoms: CustomsFormType
}

const NewVariant = ({
  id,
  source,
  index,
  save,
  remove,
  move,
  options,
  onCreateOption,
  productDimensions,
  productCustoms,
}: Props) => {
  const { t } = useTranslation()
  const { state, toggle, close } = useToggleState()
  const localForm = useForm<CreateFlowVariantFormType>({
    defaultValues: source,
  })

  const { handleSubmit, reset } = localForm

  useEffect(() => {
    reset(source)
  }, [source])

  const closeAndReset = () => {
    reset(source)
    close()
  }

  const onUpdate = handleSubmit((data) => {
    const payload = {
      ...data,
      title: data.general.title
        ? data.general.title
        : data.options.map((vo) => vo.option?.value).join(" / "),
    }

    const saved = save(index, payload)

    if (!saved) {
      localForm.setError("options", {
        type: "deps",
        message: t(
          "new-variant-a-variant-with-these-options-already-exists",
          "A variant with these options already exists."
        ),
      })
      return
    }

    closeAndReset()
  })

  const warning = useImperativeDialog()

  const onDelete = async () => {
    const confirmed = await warning({
      text: t(
        "new-variant-are-you-sure-you-want-to-delete-this-variant",
        "Are you sure you want to delete this variant?"
      ),
      heading: t("new-variant-delete-variant", "Delete Variant"),
    })

    if (confirmed) {
      remove(index)
    }
  }

  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      move(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))
  const layeredModalContext = useContext(LayeredModalContext)

  return (
    <>
      <div
        ref={preview}
        data-handler-id={handlerId}
        className={clsx(
          "rounded-rounded py-xsmall ps-xsmall pe-base focus-within:bg-grey-5 hover:bg-grey-5 grid h-16 translate-x-0 translate-y-0 grid-cols-[32px_1fr_90px_100px_48px] transition-all",
          {
            "opacity-50": isDragging,
          }
        )}
      >
        <div
          ref={ref}
          className="text-grey-40 flex cursor-move items-center justify-center"
        >
          <GripIcon size={20} />
        </div>
        <div className="ms-base flex flex-col justify-center">
          <p className="inter-base-semibold">
            {source.general.title}
            {source.stock.sku && (
              <span className="inter-base-regular ms-2xsmall text-grey-50">
                ({source.stock.sku})
              </span>
            )}
          </p>
          {source.stock.ean && (
            <span className="inter-base-regular text-grey-50">
              {source.stock.ean}
            </span>
          )}
        </div>
        <div className="me-xlarge flex items-center justify-end">
          <p>{source.stock.inventory_quantity || "-"}</p>
        </div>
        <div className="flex items-center justify-center">
          <VariantValidity
            source={source}
            productCustoms={productCustoms}
            productDimensions={productDimensions}
          />
        </div>
        <div className="ms-xlarge pe-base flex items-center justify-center">
          <Actionables
            forceDropdown
            actions={[
              {
                label: t("new-variant-edit", "Edit"),
                icon: <EditIcon size={20} />,
                onClick: toggle,
              },
              {
                label: t("new-variant-delete", "Delete"),
                icon: <TrashIcon size={20} />,
                onClick: onDelete,
                variant: "danger",
              },
            ]}
            customTrigger={
              <Button
                variant="ghost"
                className="h-xlarge w-xlarge text-grey-50 flex items-center justify-center p-0"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
      </div>
      <LayeredModal
        context={layeredModalContext}
        open={state}
        handleClose={closeAndReset}
      >
        <Modal.Body>
          <Modal.Header handleClose={closeAndReset}>
            <h1 className="inter-xlarge-semibold">
              {t("new-variant-edit-variant", "Edit Variant")}
              {source.general.title && (
                <span className="inter-xlarge-regular ms-xsmall text-grey-50">
                  ({source.general.title})
                </span>
              )}
            </h1>
          </Modal.Header>
          <Modal.Content>
            <CreateFlowVariantForm
              form={localForm}
              options={options}
              onCreateOption={onCreateOption}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={closeAndReset}
              >
                {t("new-variant-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onUpdate}
              >
                {t("new-variant-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </LayeredModal>
    </>
  )
}

const VariantValidity = ({
  source,
  productCustoms,
  productDimensions,
}: Pick<Props, "source" | "productCustoms" | "productDimensions">) => {
  const {
    options,
    dimensions,
    customs,
    stock: { barcode, upc, ean, sku, inventory_quantity },
    general: { title },
  } = source

  if (!options || !options.length) {
    return (
      <IconTooltip
        type="error"
        content={
          <div className="gap-y-2xsmall flex flex-col text-rose-50">
            <p>This variant has no options.</p>
          </div>
        }
      />
    )
  }

  const invalidOptions = options.filter((opt) => !opt.option?.value)

  if (invalidOptions?.length) {
    return (
      <IconTooltip
        type="error"
        content={
          <div className="gap-y-2xsmall flex flex-col text-rose-50">
            <p>You are missing options values for the following options:</p>
            <ul className="list-inside list-disc">
              {invalidOptions.map((io, index) => {
                return <li key={index}>{io.title || `Option ${index + 1}`}</li>
              })}
            </ul>
          </div>
        }
      />
    )
  }

  const validDimensions =
    Object.values(productDimensions).every((value) => !!value) ||
    Object.values(dimensions).every((value) => !!value)
  const validCustoms =
    Object.values(productCustoms).every((value) => !!value) ||
    Object.values(customs).every((value) => !!value)

  const barcodeValidity = !!barcode || !!upc || !!ean

  if (!sku || !validCustoms || !validDimensions || !barcodeValidity) {
    return (
      <IconTooltip
        type="warning"
        side="right"
        content={
          <div className="gap-y-2xsmall flex flex-col text-orange-50">
            <p>
              Your variant is createable, but it's missing some important
              fields:
            </p>
            <ul className="list-inside list-disc">
              {!validDimensions && <li>Dimensions</li>}
              {!validCustoms && <li>Customs</li>}
              {!inventory_quantity && <li>Inventory quantity</li>}
              {!sku && <li>SKU</li>}
              {!barcodeValidity && <li>Barcode</li>}
            </ul>
          </div>
        }
      />
    )
  }

  return (
    <Tooltip
      content={title ? `${title} is valid` : "Variant is valid"}
      side="top"
    >
      <CheckCircleFillIcon size={20} className="text-emerald-40" />
    </Tooltip>
  )
}

export default NewVariant
