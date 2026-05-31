"use client"
import { useForm } from "react-hook-form"

type AddressFormData = {
  email: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  postalCode: string
  countryCode: string
  phone: string
  giftWrap: boolean
  giftMessage: string
}

type Props = {
  initial: Partial<AddressFormData>
  onNext: (data: Partial<AddressFormData>) => void
}

const COUNTRIES = [
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "nl", name: "Netherlands" },
  { code: "be", name: "Belgium" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "au", name: "Australia" },
  { code: "ca", name: "Canada" },
]

export default function AddressStep({ initial, onNext }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AddressFormData>({
    defaultValues: { countryCode: "gb", ...initial },
  })
  const giftWrap = watch("giftWrap")

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-1">Contact & Delivery</h2>
        <p className="text-sm text-gray-400 font-sans">We'll send your order confirmation and personalisation review to this email.</p>
      </div>

      <div>
        <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Email address</label>
        <input
          {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })}
          type="email" placeholder="you@example.com"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1 font-sans">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(["firstName", "lastName"] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">
              {field === "firstName" ? "First name" : "Last name"}
            </label>
            <input
              {...register(field, { required: "Required" })}
              placeholder={field === "firstName" ? "Jane" : "Smith"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {errors[field] && <p className="text-xs text-red-500 mt-1 font-sans">{errors[field]?.message}</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Address line 1</label>
        <input
          {...register("address1", { required: "Address is required" })}
          placeholder="123 High Street"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        {errors.address1 && <p className="text-xs text-red-500 mt-1 font-sans">{errors.address1.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Address line 2 <span className="text-gray-400">(optional)</span></label>
        <input
          {...register("address2")}
          placeholder="Apartment, suite, etc."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">City</label>
          <input
            {...register("city", { required: "Required" })}
            placeholder="London"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>
        <div>
          <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Postcode / ZIP</label>
          <input
            {...register("postalCode", { required: "Required" })}
            placeholder="EC1A 1BB"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Country</label>
          <select
            {...register("countryCode", { required: "Required" })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-sans font-medium text-charcoal-800 mb-1">Phone</label>
          <input
            {...register("phone")}
            type="tel" placeholder="+44 7700 900000"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
        </div>
      </div>

      {/* Gift options */}
      <div className="border border-gold-200 rounded-2xl p-4 bg-cream-50 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input {...register("giftWrap")} type="checkbox" className="w-4 h-4 accent-gold-500" />
          <div>
            <span className="text-sm font-sans font-semibold text-charcoal-800">Add gift wrapping 🎁</span>
            <span className="block text-xs text-gray-400 font-sans">Complimentary on orders over £40</span>
          </div>
        </label>
        {giftWrap && (
          <div>
            <label className="block text-xs font-sans font-medium text-charcoal-800 mb-1">Gift message (printed on card inside)</label>
            <textarea
              {...register("giftMessage")}
              rows={2}
              placeholder="Happy Birthday! Wishing you all the love and laughter…"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
            />
          </div>
        )}
      </div>

      <button type="submit" className="w-full btn-primary py-4 text-base">
        Continue to Shipping →
      </button>
    </form>
  )
}
