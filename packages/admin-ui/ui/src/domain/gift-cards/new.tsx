import {
  useAdminCreateProduct,
  useAdminProducts,
  useAdminStore,
} from "medusa-react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import FileUploadField from "../../components/atoms/file-upload-field"
import Button from "../../components/fundamentals/button"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../components/fundamentals/icons/trash-icon"
import InputField from "../../components/molecules/input"
import Modal from "../../components/molecules/modal"
import TextArea from "../../components/molecules/textarea"
import CurrencyInput from "../../components/organisms/currency-input"
import useNotification from "../../hooks/use-notification"
import Medusa from "../../services/api"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"
import { focusByName } from "../../utils/focus-by-name"

type NewGiftCardProps = {
  onClose: () => void
}

type NewGiftCardFormData = {
  title: string
  description: string | undefined
  thumbnail: {
    url: string
    name: string
    size: number
    nativeFile: File
  } | null
  denominations: {
    amount: number | null
  }[]
}

const NewGiftCard = ({ onClose }: NewGiftCardProps) => {
  const { store } = useAdminStore()
  const { refetch } = useAdminProducts()
  const { mutate, isLoading } = useAdminCreateProduct()
  const navigate = useNavigate()
  const notification = useNotification()
  const { t } = useTranslation()

  const { register, setValue, handleSubmit, control } =
    useForm<NewGiftCardFormData>({
      shouldUnregister: true,
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "denominations",
  })

  const handleFileUpload = (files: File[]) => {
    const file = files[0]
    const url = URL.createObjectURL(file)

    setValue("thumbnail", {
      url,
      name: file.name,
      size: file.size,
      nativeFile: file,
    })
  }

  const thumbnail = useWatch({
    control,
    name: "thumbnail",
  })

  const onSubmit = async (data: NewGiftCardFormData) => {
    const trimmedName = data.title.trim()

    if (!trimmedName) {
      notification(
        t("gift-cards-error", "Error"),
        t(
          "gift-cards-please-enter-a-name-for-the-gift-card",
          "Please enter a name for the Gift Card"
        ),
        "error"
      )
      focusByName("name")
      return
    }

    if (!data.denominations?.length) {
      notification(
        t("gift-cards-error", "Error"),
        t(
          "gift-cards-please-add-at-least-one-denomination",
          "Please add at least one denomination"
        ),
        "error"
      )
      focusByName("add-denomination")
      return
    }

    let images: string[] = []

    if (thumbnail) {
      const uploadedImgs = await Medusa.uploads
        .create([thumbnail.nativeFile])
        .then(({ data }) => {
          const uploaded = data.uploads.map(({ url }) => url)
          return uploaded
        })

      images = uploadedImgs
    }

    mutate(
      {
        is_giftcard: true,
        title: data.title,
        description: data.description,
        discountable: false,
        options: [{ title: t("gift-cards-denominations", "Denominations") }],
        variants: data.denominations.map((d, i) => ({
          title: `${i + 1}`,
          inventory_quantity: 0,
          manage_inventory: false,
          prices: [
            { amount: d.amount!, currency_code: store?.default_currency_code },
          ],
          options: [{ value: `${d.amount}` }],
        })),
        images: images.length ? images : undefined,
        thumbnail: images.length ? images[0] : undefined,
        status: ProductStatus.PUBLISHED,
      },
      {
        onSuccess: () => {
          notification(
            t("gift-cards-success", "Success"),
            t(
              "gift-cards-successfully-created-gift-card",
              "Successfully created Gift Card"
            ),
            "success"
          )
          refetch()
          navigate("/a/gift-cards/manage")
        },
        onError: (err) => {
          notification(
            t("gift-cards-error", "Error"),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  }

  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <div>
              <h1 className="inter-xlarge-semibold">
                {t("gift-cards-create-gift-card", "Create Gift Card")}
              </h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-base">
              <h3 className="inter-base-semibold">
                {t("gift-cards-gift-card-details", "Gift Card Details")}
              </h3>
            </div>
            <div className="gap-y-base flex flex-col">
              <InputField
                label={t("gift-cards-name", "Name")}
                required
                placeholder={t(
                  "gift-cards-the-best-gift-card",
                  "The best Gift Card"
                )}
                {...register("title", { required: true })}
              />
              <TextArea
                label={t("gift-cards-description", "Description")}
                placeholder={t(
                  "gift-cards-the-best-gift-card-of-all-time",
                  "The best Gift Card of all time"
                )}
                {...register("description")}
              />
            </div>
            <div className="mt-xlarge">
              <h3 className="inter-base-semibold">
                {t("gift-cards-thumbnail", "Thumbnail")}
              </h3>
              <div className="mt-base h-[80px]">
                {thumbnail ? (
                  <div className="flex items-center gap-x-6">
                    <img
                      src={thumbnail.url}
                      alt=""
                      className="rounded-base h-20 w-20 object-cover object-center"
                    />
                    <div className="flex flex-col gap-y-1">
                      <span className="inter-small-regular">
                        {thumbnail.name}
                      </span>
                      <div>
                        <button
                          className="inter-small-semibold text-rose-50"
                          type="button"
                          onClick={() => setValue("thumbnail", null)}
                        >
                          {t("gift-cards-delete", "Delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FileUploadField
                    filetypes={[
                      "image/gif",
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ]}
                    onFileChosen={handleFileUpload}
                    placeholder={t(
                      "gift-cards-size-recommended",
                      "1200 x 1600 (3:4) recommended, up to 10MB each"
                    )}
                  />
                )}
              </div>
            </div>
            <div className="mt-xlarge">
              <h3 className="inter-base-semibold mb-base">
                {t("gift-cards-denominations", "Denominations")}
                <span className="text-rose-50">*</span>
              </h3>
              <div className="gap-y-xsmall flex flex-col">
                {fields.map((denomination, index) => {
                  return (
                    <div
                      key={denomination.id}
                      className="gap-x-base last:mb-large flex items-end"
                    >
                      <CurrencyInput.Root
                        currentCurrency={store?.default_currency_code}
                        readOnly
                        size="medium"
                      >
                        <Controller
                          control={control}
                          name={`denominations.${index}.amount`}
                          rules={{
                            required: true,
                            shouldUnregister: true,
                          }}
                          render={({ field: { value, onChange, ref } }) => {
                            return (
                              <CurrencyInput.Amount
                                label={t("gift-cards-amount", "Amount")}
                                amount={value || undefined}
                                onChange={onChange}
                                ref={ref}
                              />
                            )
                          }}
                        />
                      </CurrencyInput.Root>
                      <Button
                        variant="ghost"
                        size="large"
                        className="text-grey-40 h-10 w-10"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon size={20} />
                      </Button>
                    </div>
                  )
                })}
              </div>
              <Button
                name="add-denomination"
                variant="ghost"
                size="small"
                onClick={() =>
                  append({
                    amount: undefined,
                  })
                }
                type="button"
              >
                <PlusIcon size={20} />
                {t("gift-cards-add-denomination", "Add Denomination")}
              </Button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end">
              <Button
                type="submit"
                variant="ghost"
                size="small"
                className="w-eventButton"
                onClick={onClose}
              >
                {t("gift-cards-cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton"
                loading={isLoading}
                disabled={isLoading}
              >
                {t("gift-cards-create-publish", "Create & Publish")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default NewGiftCard
