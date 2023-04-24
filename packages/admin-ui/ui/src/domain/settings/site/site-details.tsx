import { Reducer, useEffect, useMemo, useReducer, useState } from "react"
import { useForm } from "react-hook-form"
import Medusa from "../../../services/api"
import FileUploadField from "../../../components/atoms/file-upload-field"
import Button from "../../../components/fundamentals/button"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import Textarea from "../../../components/molecules/textarea"
import BodyCard from "../../../components/organisms/body-card"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import { AdminPostStoreReq } from "@medusajs/medusa"
import {
  useAdminUpdateSiteDetails,
  useFontsList,
  useGetSiteSettings,
} from "../../../hooks/admin"
import InputHeader from "../../../components/fundamentals/input-header"
import Select from "../../../components/molecules/select/next-select/select"
import {
  colorOptions,
  colorRange,
  defaultAccentThemeColors,
  defaultColorOptions,
  defaultHighlightThemeColors,
  defaultPrimaryThemeColors,
  selectFontOptions,
  SiteDetailsAction,
  siteDetailsReducer,
  SiteDetailsState,
} from "./site-details.helpers"
import * as Collapsible from "@radix-ui/react-collapsible"
import InputField from "../../../components/molecules/input"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import MinusIcon from "../../../components/fundamentals/icons/minus-icon"
import tailwindColors from "tailwindcss/colors"
import Spinner from "../../../components/atoms/spinner"
import Checkbox from "../../../components/atoms/checkbox"

interface LogoFile {
  url?: string
  name?: string
  size?: number
  file?: File
}

const SiteDetails = () => {
  const { register, reset, handleSubmit, setValue, watch } = useForm()
  const { store } = useAdminStore()
  const { site_settings: siteSettings } = useGetSiteSettings()
  const [state, dispatch] = useReducer<
    Reducer<SiteDetailsState, SiteDetailsAction>
  >(siteDetailsReducer, {
    toggle: {},
  })

  const { fonts } = useFontsList()
  const fontsOptions = useMemo(() => selectFontOptions(fonts), [fonts])

  const updateStore = useAdminUpdateStore()
  const updateSiteDetails = useAdminUpdateSiteDetails()
  const notification = useNotification()
  const initialLogo = (store as any)?.logo
    ? { url: (store as any)?.logo.url }
    : undefined

  const initialFavicon = (siteSettings as any)?.favicon
    ? { url: (siteSettings as any)?.favicon.url }
    : undefined

  const [logo, setLogo] = useState<LogoFile | null | undefined>(initialLogo)
  const [favicon, setFavicon] = useState<LogoFile | null | undefined>(
    initialFavicon
  )

  const adminStoreSettingsKeys = ["name"]
  const siteDetailsSettingsKeys = [
    "description",
    "header_code",
    "footer_code",
    "storefront_url",
    "primary_theme_colors",
    "accent_theme_colors",
    "highlight_theme_colors",
    "body_font",
    "display_font",
    "include_site_name_beside_logo",
    "social_instagram",
    "social_youtube",
    "social_facebook",
    "social_twitter",
    "social_linkedin",
    "social_pinterest",
    "social_tiktok",
    "social_snapchat",
  ]

  const defaultValues = {
    ...store,
    include_site_name_beside_logo: false,
    ...siteSettings,
    primary_theme_colors: {
      DEFAULT:
        siteSettings?.primary_theme_colors?.["400"] ||
        defaultPrimaryThemeColors["400"],
      ...(siteSettings?.primary_theme_colors || defaultPrimaryThemeColors),
    },
    accent_theme_colors: {
      DEFAULT:
        siteSettings?.accent_theme_colors?.["400"] ||
        defaultAccentThemeColors["400"],
      ...(siteSettings?.accent_theme_colors || defaultAccentThemeColors),
    },
    highlight_theme_colors: {
      DEFAULT:
        siteSettings?.highlight_theme_colors?.["400"] ||
        defaultHighlightThemeColors["400"],
      ...(siteSettings?.highlight_theme_colors || defaultHighlightThemeColors),
    },
  }

  useEffect(() => {
    reset(defaultValues)
    setLogo(initialLogo)
    setFavicon(initialFavicon)
  }, [store, siteSettings, reset])

  const handleCancel = () => {
    reset(defaultValues)
    setLogo(initialLogo)
  }

  const onSubmit = async (data) => {
    const logoToUpload =
      logo && logo.url && logo.url.startsWith("blob:") ? logo.file : undefined

    const faviconToUpload =
      favicon && favicon.url && favicon.url.startsWith("blob:")
        ? favicon.file
        : undefined

    let uploadedLogo
    if (logoToUpload) {
      uploadedLogo = await Medusa.uploads
        .create([logoToUpload])
        .then(({ data }) => {
          return data.uploads[0]
        })
        .catch((err) => {
          notification("Error uploading images", getErrorMessage(err), "error")
          return
        })
    }

    let uploadedFavicon
    if (faviconToUpload) {
      uploadedFavicon = await Medusa.uploads

        .create([faviconToUpload])
        .then(({ data }) => {
          return data.uploads[0]
        })
        .catch((err) => {
          notification("Error uploading images", getErrorMessage(err), "error")
          return
        })
    }

    const newStoreData = {
      logo: uploadedLogo ? uploadedLogo.url : logo === null ? logo : undefined,
    }

    adminStoreSettingsKeys.forEach((property) => {
      newStoreData[property] = data[property]
    })

    updateStore.mutate(newStoreData as AdminPostStoreReq, {
      onSuccess: () => {
        const newSiteDetailsData = {
          favicon: uploadedFavicon
            ? uploadedFavicon.url
            : uploadedFavicon === null
            ? uploadedFavicon
            : undefined,
        }

        siteDetailsSettingsKeys.forEach((property) => {
          newSiteDetailsData[property] = data[property]
        })

        updateSiteDetails.mutate(newSiteDetailsData, {
          onSuccess: () => {
            reset({
              ...defaultValues,
              ...newStoreData,
              ...newSiteDetailsData,
            })
            notification(
              "Success",
              "Successfully updated site settings",
              "success"
            )
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        })
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  if (!defaultValues) return <Spinner />

  return (
    <form>
      <BreadCrumb
        previousRoute="/admin/settings"
        previousBreadcrumb="Settings"
        currentPage="Site Details"
      />
      <BodyCard
        events={[
          {
            label: "Save",
            type: "button",
            onClick: handleSubmit(onSubmit),
          },
          { label: "Cancel Changes", type: "button", onClick: handleCancel },
        ]}
        title="Site Details"
      >
        <div>
          <div className="grid-cols-2 grid gap-x-8 gap-y-4">
            <Input
              label="Site Name"
              placeholder="Enter your site name"
              {...register("name")}
            />

            <Input
              label="Storefront URL"
              placeholder="https://my-store.com"
              {...register("storefront_url")}
            />

            {/* <Input
              label="Primary Color (hex value)"
              name="primary_color"
              prefix="#"
              placeholder="3F54C6"
              ref={register}
            /> */}
            <div className="col-span-2">
              <Textarea
                label="Description"
                placeholder="Enter a short description (between 50 and 160 characters)"
                rows={2}
                {...register("description")}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="grid-cols-2 grid gap-x-8 gap-y-4">
              <div className="col-span-2 medium:col-span-1">
                <InputHeader label="Header Logo" className="mb-xsmall" />
                {logo && (
                  <div>
                    <Button
                      onClick={() => setLogo(null)}
                      variant="ghost"
                      className="w-full group flex border-2 border-dashed border-gray-200 hover:border-dashed hover:border-violet-60 p-base mb-base cursor-pointer"
                    >
                      <div className="relative max-w-full h-20 flex items-center">
                        <img
                          src={logo.url}
                          alt="Site logo"
                          className="max-w-full h-14 object-contain"
                        />
                        <div className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-60 text-white p-2 rounded-full">
                          <TrashIcon />
                        </div>
                      </div>
                    </Button>
                    <Checkbox
                      label="Show the site name beside the logo"
                      {...register(`include_site_name_beside_logo`)}
                    />
                  </div>
                )}

                {!logo && (
                  <div>
                    <FileUploadField
                      onFileChosen={(files) => {
                        const file = files[0]
                        const url = URL.createObjectURL(file)

                        setLogo({
                          url,
                          name: file.name,
                          size: file.size,
                          file,
                        })
                      }}
                      placeholder="This logo will be used for the site header"
                      filetypes={[
                        "image/gif",
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                      ]}
                      className="py-large h-[116px]"
                    />
                  </div>
                )}
              </div>
              <div className="col-span-2 medium:col-span-1">
                <InputHeader label="Favicon" className="mb-xsmall" />
                {favicon && (
                  <Button
                    onClick={() => setFavicon(null)}
                    variant="ghost"
                    className="w-full group flex border-2 border-dashed border-gray-200 hover:border-dashed hover:border-violet-60 p-base mb-base cursor-pointer"
                  >
                    <div className="relative max-w-full h-20 flex items-center">
                      <img
                        src={favicon.url}
                        alt="Site logo"
                        className="max-w-full h-14 object-contain"
                      />
                      <div className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-60 text-white p-2 rounded-full">
                        <TrashIcon />
                      </div>
                    </div>
                  </Button>
                )}

                {!favicon && (
                  <div>
                    <FileUploadField
                      onFileChosen={(files) => {
                        const file = files[0]
                        const url = URL.createObjectURL(file)

                        setFavicon({
                          url,
                          name: file.name,
                          size: file.size,
                          file,
                        })
                      }}
                      placeholder="This favicon will be used in the browser tab"
                      filetypes={["image/gif", "image/jpeg", "image/png"]}
                      className="py-large h-[116px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*
        <h6 className="inter-base-semibold mt-large mb-base">Profile</h6>

        <div className="grid-cols-1 small:grid-cols-2 grid gap-x-8 gap-y-4">
          <div className="col-span-1">
            <Input label="Contact Email" name="email" ref={register} />
          </div>
        </div> */}

        <h6 className="inter-base-semibold mt-large mb-base">Theme</h6>
        <div className="grid grid-cols-1 medium:grid-cols-3 gap-4">
          {["Primary", "Accent", "Highlight"].map((themeColor) => (
            <div key={themeColor}>
              <Select
                isMulti={false}
                label={`${themeColor} Color`}
                options={colorOptions}
                onChange={(selectedOption) => {
                  if (selectedOption?.value === "custom") {
                    dispatch({
                      type: "openColorToggle",
                      payload: `${themeColor.toLowerCase()}_theme_color`,
                    })
                    colorRange.forEach((colorType) => {
                      setValue(
                        `${themeColor.toLowerCase()}_theme_colors.${colorType}`,
                        ""
                      )
                    })
                    setValue(
                      `${themeColor.toLowerCase()}_theme_colors.DEFAULT`,
                      ""
                    )
                  } else if (selectedOption) {
                    colorRange.forEach((colorType) => {
                      setValue(
                        `${themeColor.toLowerCase()}_theme_colors.${colorType}`,
                        tailwindColors[selectedOption.value.toLowerCase()][
                          colorType
                        ]
                      )
                      if (colorType === "400") {
                        setValue(
                          `${themeColor.toLowerCase()}_theme_colors.DEFAULT`,
                          tailwindColors[selectedOption.value.toLowerCase()][
                            colorType
                          ]
                        )
                      }
                    })
                  }
                }}
                value={
                  colorOptions[
                    colorOptions.findIndex((color) => {
                      if (!tailwindColors[color.value])
                        return color.value === "custom"

                      if (
                        watch(
                          `${themeColor.toLowerCase()}_theme_colors.400`
                        ) === tailwindColors[color.value][400]
                      )
                        return true
                    })
                  ]
                }
              />

              <Collapsible.Root
                open={state.toggle[`${themeColor.toLowerCase()}_theme_color`]}
                onOpenChange={() =>
                  dispatch({
                    type: "toggle",
                    payload: `${themeColor.toLowerCase()}_theme_color`,
                  })
                }
              >
                <Collapsible.Trigger className="w-full">
                  <span className="flex items-center mt-4 pl-3 text-xs">
                    Override {themeColor} Colors
                    {state.toggle[`${themeColor.toLowerCase()}_theme_color`] ? (
                      <MinusIcon size={16} className="ml-2" />
                    ) : (
                      <PlusIcon size={16} className="ml-2" />
                    )}
                  </span>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <Select
                    isMulti={false}
                    className={`mt-2 [&>div:first-of-type]:before:content-["Default_Color:"] [&>div:first-of-type]:items-center [&>div:first-of-type]:before:text-xs [&>div:first-of-type]:before:text-grey-40 [&>div:first-of-type]:before:mr-2`}
                    {...register(
                      `${themeColor.toLowerCase()}_theme_colors.DEFAULT`
                    )}
                    options={defaultColorOptions(themeColor, watch)}
                    value={defaultColorOptions(themeColor, watch).find(
                      ({ value }) => {
                        return (
                          value ===
                          watch(
                            `${themeColor.toLowerCase()}_theme_colors.DEFAULT`
                          )
                        )
                      }
                    )}
                    onChange={(selectedOption) => {
                      if (selectedOption)
                        setValue(
                          `${themeColor.toLowerCase()}_theme_colors.DEFAULT`,
                          selectedOption.value
                        )
                    }}
                  />
                  <div className="grid grid-cols-2 medium:grid-cols-1 gap-2 mt-2">
                    {colorRange.map((colorType) => (
                      <InputField
                        key={colorType}
                        prefix={`${colorType}: `}
                        suffix={
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: watch(
                                `${themeColor.toLowerCase()}_theme_colors.${colorType}`
                              ),
                            }}
                          />
                        }
                        placeholder="Enter a hex value"
                        {...register(
                          `${themeColor.toLowerCase()}_theme_colors.${colorType}`
                        )}
                      />
                    ))}
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Select
            label="Display Font"
            options={fontsOptions}
            value={fontsOptions.find(
              (option) => option.value === (watch("display_font") || {}).family
            )}
            onChange={(selectedOption) => {
              if (selectedOption)
                setValue(
                  "display_font",
                  fonts.find((font) => font.family === selectedOption.value)
                )
            }}
          />

          <Select
            label="Body Font"
            options={fontsOptions}
            value={fontsOptions.find(
              (option) => option.value === (watch("body_font") || {}).family
            )}
            onChange={(selectedOption) => {
              if (selectedOption)
                setValue(
                  "body_font",
                  fonts.find((font) => font.family === selectedOption.value)
                )
            }}
          />
        </div>

        <h6 className="inter-base-semibold mt-large mb-base">
          Social Media Links
        </h6>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Instagram"
            placeholder="https://instagram.com/..."
            {...register(`social_instagram`)}
          />
          <InputField
            label="YouTube"
            placeholder="https://youtube.com/..."
            {...register(`social_youtube`)}
          />
          <InputField
            label="Facebook"
            placeholder="https://facebook.com/..."
            {...register(`social_facebook`)}
          />
          <InputField
            label="Twitter"
            placeholder="https://twitter.com/..."
            {...register(`social_twitter`)}
          />
          <InputField
            label="LinkedIn"
            placeholder="https://linkedin.com/..."
            {...register(`social_linkedin`)}
          />
          <InputField
            label="Pinterest"
            placeholder="https://pinterest.com/..."
            {...register(`social_pinterest`)}
          />
          <InputField
            label="TikTok"
            placeholder="https://tiktok.com/..."
            {...register(`social_tiktok`)}
          />
          <InputField
            label="Snapchat"
            placeholder="https://snapchat.com/..."
            {...register(`social_snapchat`)}
          />
        </div>

        <h6 className="inter-base-semibold mt-large mb-base">Advanced</h6>

        <div className="grid-cols-1 grid gap-x-8 gap-y-4">
          <div className="col-span-1">
            <Textarea
              resize
              label="Header code"
              placeholder="This code will be injected at the bottom of the <head> tag"
              rows={4}
              {...register("header_code")}
            />
          </div>
          <div className="col-span-1">
            <Textarea
              resize
              label="Footer code"
              placeholder="This code will be injected at the bottom of the <body> tag"
              rows={4}
              {...register("footer_code")}
            />
          </div>
        </div>
      </BodyCard>
    </form>
  )
}

// const validateUrl = (address) => {
//   if (!address || address === "") {
//     return true
//   }

//   try {
//     const url = new URL(address)
//     return url.protocol === "http:" || url.protocol === "https:"
//   } catch (_) {
//     return false
//   }
// }

export default SiteDetails
