import { useTranslation } from "react-i18next"
import DiscountableForm, {
  DiscountableFormType,
} from "../../forms/product/discountable-form"
import GeneralForm, { GeneralFormType } from "../../forms/product/general-form"
import OrganizeForm, {
  OrganizeFormType,
} from "../../forms/product/organize-form"

import { Product } from "@medusajs/medusa"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import { nestedForm } from "../../../utils/nested-form"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../forms/general/metadata-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type GeneralFormWrapper = {
  general: GeneralFormType
  organize: OrganizeFormType
  discountable: DiscountableFormType
  metadata: MetadataFormType
}

const GeneralModal = ({ product, open, onClose }: Props) => {
  const { t } = useTranslation()
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<GeneralFormWrapper>({
    defaultValues: getDefaultValues(product),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product, reset])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        title: data.general.title,
        handle: data.general.handle,
        // @ts-ignore
        material: data.general.material,
        // @ts-ignore
        subtitle: data.general.subtitle,
        // @ts-ignore
        description: data.general.description,
        // @ts-ignore
        type: data.organize.type
          ? {
              id: data.organize.type.value,
              value: data.organize.type.label,
            }
          : null,
        // @ts-ignore
        collection_id: data.organize.collection
          ? data.organize.collection.value
          : null,
        // @ts-ignore
        tags: data.organize.tags
          ? data.organize.tags.map((t) => ({ value: t }))
          : null,

        categories: data.organize?.categories?.length
          ? data.organize.categories.map((id) => ({ id }))
          : [],
        discountable: data.discountable.value,
        metadata: getSubmittableMetadata(data.metadata),
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            {t(
              "product-general-section-edit-general-information",
              "Edit General Information"
            )}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <GeneralForm
              form={nestedForm(form, "general")}
              isGiftCard={product.is_giftcard}
            />
            <div className="my-xlarge">
              <h2 className="inter-base-semibold mb-base">
                Organize{" "}
                {product.is_giftcard
                  ? t("product-general-section-gift-card", "Gift Card")
                  : t("product-general-section-product", "Product")}
              </h2>
              <OrganizeForm form={nestedForm(form, "organize")} />
            </div>
            <DiscountableForm
              form={nestedForm(form, "discountable")}
              isGiftCard={product.is_giftcard}
            />
            <div className="mt-xlarge">
              <h2 className="inter-base-semibold mb-base">
                {t("product-general-section-metadata", "Metadata")}
              </h2>
              <MetadataForm form={nestedForm(form, "metadata")} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                {t("product-general-section-cancel", "Cancel")}
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                {t("product-general-section-save", "Save")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): GeneralFormWrapper => {
  return {
    general: {
      title: product.title,
      subtitle: product.subtitle,
      material: product.material,
      handle: product.handle!,
      description: product.description || null,
    },
    organize: {
      collection: product.collection
        ? { label: product.collection.title, value: product.collection.id }
        : null,
      type: product.type
        ? { label: product.type.value, value: product.type.id }
        : null,
      tags: product.tags ? product.tags.map((t) => t.value) : null,
      categories: product.categories?.map((c) => c.id),
    },
    discountable: {
      value: product.discountable,
    },
    metadata: getMetadataFormValues(product.metadata),
  }
}

export default GeneralModal
