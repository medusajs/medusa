"use client"
import { useForm } from "react-hook-form"
import { useState } from "react"

const OCCASIONS = [
  "Birthday", "Anniversary", "Wedding", "Graduation",
  "Baby Shower", "Valentine's Day", "Mother's Day",
  "Father's Day", "Christmas", "Other",
]

const FONTS = ["Classic Serif", "Modern Script", "Bold Block", "Handwritten", "Elegant Italic"]

type Field =
  | "recipient_name"
  | "sender_name"
  | "date"
  | "message"
  | "occasion"
  | "font_style"
  | "nfc_url"
  | "file_upload"

type Props = {
  fields: Field[]
  maxChars?: number
  onSubmit: (data: Record<string, string | FileList>) => void
  productionDays?: number
}

const FIELD_CONFIG: Record<Field, { label: string; placeholder: string; type: string; hint?: string }> = {
  recipient_name: { label: "Recipient's Name", placeholder: "e.g. Sarah", type: "text" },
  sender_name:    { label: "Your Name (From)", placeholder: "e.g. Mum & Dad", type: "text" },
  date:           { label: "Special Date", placeholder: "e.g. 14 February 2025", type: "text", hint: "Wedding date, birthday, anniversary, etc." },
  message:        { label: "Personal Message", placeholder: "Write something heartfelt…", type: "textarea" },
  occasion:       { label: "Occasion", placeholder: "Select occasion", type: "select" },
  font_style:     { label: "Font Style", placeholder: "Choose a font", type: "font_select" },
  nfc_url:        { label: "Digital Content Link (NFC)", placeholder: "https://youtube.com/...", type: "url", hint: "Link to your video, photo album, or any URL. Set this up after purchase too." },
  file_upload:    { label: "Upload Photo or Logo", placeholder: "", type: "file", hint: "JPG, PNG, or SVG. Max 10MB. High resolution recommended." },
}

export default function PersonalizationForm({ fields, maxChars = 80, onSubmit, productionDays }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Record<string, any>>()
  const messageValue = watch("message", "")
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-gold-200">
        <span className="text-gold-500 text-lg">✏️</span>
        <h3 className="font-serif text-lg font-semibold text-charcoal-900">Personalise Your Gift</h3>
      </div>

      {fields.map((field) => {
        const config = FIELD_CONFIG[field]
        if (!config) return null

        return (
          <div key={field} className="space-y-1.5">
            <label className="block text-sm font-sans font-medium text-charcoal-800">
              {config.label}
            </label>

            {config.type === "text" || config.type === "url" ? (
              <input
                {...register(field, {
                  required: ["recipient_name"].includes(field) ? "This field is required" : false,
                })}
                type={config.type === "url" ? "url" : "text"}
                placeholder={config.placeholder}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition bg-white"
              />
            ) : config.type === "textarea" ? (
              <div className="relative">
                <textarea
                  {...register("message", {
                    maxLength: { value: maxChars, message: `Maximum ${maxChars} characters` },
                  })}
                  placeholder={config.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition bg-white resize-none"
                />
                <span className={`absolute bottom-2 right-3 text-xs font-sans ${messageValue.length > maxChars ? "text-red-500" : "text-gray-400"}`}>
                  {messageValue.length}/{maxChars}
                </span>
              </div>
            ) : config.type === "select" ? (
              <select
                {...register(field)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition bg-white appearance-none"
              >
                <option value="">Select an occasion…</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : config.type === "font_select" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FONTS.map((font) => (
                  <label key={font} className="cursor-pointer">
                    <input
                      {...register("font_style")}
                      type="radio"
                      value={font}
                      className="sr-only peer"
                    />
                    <div className="px-3 py-2 text-center text-sm border border-gray-200 rounded-lg peer-checked:border-gold-500 peer-checked:bg-gold-50 peer-checked:text-gold-700 hover:border-gold-300 transition font-sans">
                      {font}
                    </div>
                  </label>
                ))}
              </div>
            ) : config.type === "file" ? (
              <div>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gold-300 rounded-xl cursor-pointer bg-cream-50 hover:bg-cream-100 transition">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="h-full object-contain py-2 rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl block mb-1">📎</span>
                      <span className="text-sm text-gray-500 font-sans">Click to upload photo or logo</span>
                    </div>
                  )}
                  <input
                    {...register("file_upload")}
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : null}

            {config.hint && (
              <p className="text-xs text-gray-400 font-sans">{config.hint}</p>
            )}
            {errors[field] && (
              <p className="text-xs text-red-500 font-sans">{String(errors[field]?.message)}</p>
            )}
          </div>
        )
      })}

      {productionDays && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-xl">⏱️</span>
          <div>
            <p className="text-sm font-sans font-medium text-amber-800">
              Production time: {productionDays} business day{productionDays > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-amber-600 font-sans">
              Your personalised item is made to order with care.
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-sans font-semibold text-base transition-colors shadow-gold-md"
      >
        Add to Cart — Personalised Just for You 🎁
      </button>
    </form>
  )
}
