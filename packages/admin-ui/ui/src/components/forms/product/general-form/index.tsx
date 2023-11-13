import { Controller } from "react-hook-form"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputHeader from "../../../fundamentals/input-header"
import InputField from "../../../molecules/input"

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }], // Add color and background color buttons to toolbar
    [{ direction: 'rtl' }, { direction: 'ltr' }], // Add direction changer to toolbar
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
const formats = [
  'header',
  'font',
  'size',
  'color',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]




export type GeneralFormType = {
  title: string
  title_ar: string
  subtitle: string | null
  subtitle_ar: string | null
  handle: string
  handle_ar: string
  material: string | null
  description: ReactQuill.Value
  description_ar: ReactQuill.Value
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
  isGiftCard?: boolean
}

const GeneralForm = ({ form, requireHandle = true, isGiftCard }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="gap-x-large mb-small medium:grid medium:grid-cols-2 flex flex-col">
        <InputField
          label="Title"
          placeholder={isGiftCard ? "Gift Card" : "Winter Jacket"}
          required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label="Subtitle"
          placeholder="Warm and cozy..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Give your {isGiftCard ? "gift card" : "product"} a short and clear
        title.
        <br />
        50-60 characters is the recommended length for search engines.
      </p>
      <div className="gap-x-large mb-smallflex medium:grid medium:grid-cols-2 flex-col">
        <InputField
          label="العنوان"
          placeholder={isGiftCard ? "كرت هدية" : "سترة الشتاء"}
          required
          {...register(path("title_ar"), {
            required: "Title ar is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label="العنوان الفرعي"
          placeholder="دافئة ومريحة"
          {...register(path("subtitle_ar"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <div className="gap-x-large mb-largeflex medium:grid medium:grid-cols-2 flex-col">
        <InputField
          label="Handle"
          tooltipContent={
            !requireHandle
              ? `The handle is the part of the URL that identifies the ${
                  isGiftCard ? "gift card" : "product"
                }. If not specified, it will be generated from the title.`
              : undefined
          }
          placeholder={isGiftCard ? "gift-card" : "winter-jacket"}
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Handle is required" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        <InputField
          label="Material"
          placeholder={isGiftCard ? "Paper" : "100% Cotton"}
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Material"),
            pattern: FormValidator.whiteSpaceRule("Material"),
          })}
          errors={errors}
        />
      </div>
      <div className="gap-x-large mb-largeflex medium:grid medium:grid-cols-2 flex-col">
        <InputField
          label="handle arabic"
          {...register(path("handle_ar"), {
            required: requireHandle ? "Handle is required" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          errors={errors}
        />
      </div>
      {/* <TextArea
        label="Description"
        placeholder={
          isGiftCard ? "The gift card is..." : "A warm and cozy jacket..."
        }
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      <TextArea
        label="Description in arabic"
        placeholder={
          isGiftCard ? "The gift card is..." : "A warm and cozy jacket..."
        }
        rows={3}
        className="mb-small"
        {...register(path("description_ar"))}
        errors={errors}
      /> */}
      <div className="mb-large">
        <InputHeader label="Description" className="mb-xsmall" />
        <Controller
          name={path("description")}
          control={form.control}
          defaultValue=""
          render={({ field }) => (
            <ReactQuill
              modules={modules} 
              theme="snow"
              value={form.getValues(path("description"))}
              onChange={(value) => {
                field.onChange(value)
              }}
            />
          )}
        />
      </div>
      <div>
        <InputHeader label="Description in arabic" className="mb-xsmall" />
        <Controller
          name={path("description_ar")}
          control={form.control}
          defaultValue=""
          render={({ field }) => (
            <ReactQuill
              modules={modules}
              theme="snow"
              value={form.getValues(path("description_ar"))}
              onChange={(value) => {
                field.onChange(value)
              }}
            />
          )}
        />
      </div>

      <p className="inter-base-regular text-grey-50">
        Give your {isGiftCard ? "gift card" : "product"} a short and clear
        description.
        <br />
        120-160 characters is the recommended length for search engines.
      </p>
    </div>
  )
}

export default GeneralForm
