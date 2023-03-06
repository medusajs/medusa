import {
  useAdminCreateProduct,
  useAdminProducts,
  useAdminStore,
} from "medusa-react"
import React from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
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
      notification("Error", "Please enter a name for the Gift Card", "error")
      focusByName("name")
      return
    }

    if (!data.denominations?.length) {
      notification("Error", "Please add at least one denomination", "error")
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
        options: [{ title: "Denominations" }],
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
          notification("Success", "Successfully created Gift Card", "success")
          refetch()
          navigate("/a/gift-cards/manage")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
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
              <h1 className="inter-xlarge-semibold">Create Gift Card</h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-base">
              <h3 className="inter-base-semibold">Gift Card Details</h3>
            </div>
            <div className="flex flex-col gap-y-base">
              <InputField
                label={"Name"}
                required
                placeholder="The best Gift Card"
                {...register("title", { required: true })}
              />
              <TextArea
                label="Description"
                placeholder="The best Gift Card of all time"
                {...register("description")}
              />
            </div>
            <div className="mt-xlarge">
              <h3 className="inter-base-semibold">Thumbnail</h3>
              <div className="h-[80px] mt-base">
                {thumbnail ? (
                  <div className="flex items-center gap-x-6">
                    <img
                      src={thumbnail.url}
                      alt=""
                      className="w-20 h-20 rounded-base object-cover object-center"
                    />
                    <div className="flex flex-col gap-y-1">
                      <span className="inter-small-regular">
                        {thumbnail.name}
                      </span>
                      <div>
                        <button
                          className="text-rose-50 inter-small-semibold"
                          type="button"
                          onClick={() => setValue("thumbnail", null)}
                        >
                          Delete
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
                    placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
                  />
                )}
              </div>
            </div>
            <div className="mt-xlarge">
              <h3 className="inter-base-semibold mb-base">
                Denominations<span className="text-rose-50">*</span>
              </h3>
              <div className="flex flex-col gap-y-xsmall">
                {fields.map((denomination, index) => {
                  return (
                    <div
                      key={denomination.id}
                      className="flex items-end gap-x-base last:mb-large"
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
                                label="Amount"
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
                        className="w-10 h-10 text-grey-40"
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
                Add Denomination
              </Button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full">
              <Button
                type="submit"
                variant="ghost"
                size="small"
                className="w-eventButton"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton"
                loading={isLoading}
                disabled={isLoading}
              >
                Create & Publish
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default NewGiftCard
