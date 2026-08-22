"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) {
      return locale.region.toUpperCase()
    }
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type LanguageSelectProps = {
  toggleState: StateType
  locales: Locale[]
  currentLocale: string | null
}

/**
 * Gets the localized display name for a language code using Intl API.
 * Falls back to the provided name if Intl is unavailable.
 */
const getLocalizedLanguageName = (
  code: string,
  fallbackName: string,
  displayLocale: string = "en-US"
): string => {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "language",
    })
    return displayNames.of(code) ?? fallbackName
  } catch {
    return fallbackName
  }
}

const DEFAULT_OPTION: LanguageOption = {
  code: "",
  name: "Default",
  localizedName: "Default",
  countryCode: "",
}

const LanguageSelect = ({
  toggleState,
  locales,
  currentLocale,
}: LanguageSelectProps) => {
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { state, close } = toggleState

  const options = useMemo(() => {
    const localeOptions = locales.map((locale) => ({
      code: locale.code,
      name: locale.name,
      localizedName: getLocalizedLanguageName(
        locale.code,
        locale.name,
        currentLocale ?? "en-US"
      ),
      countryCode: getCountryCodeFromLocale(locale.code),
    }))
    return [DEFAULT_OPTION, ...localeOptions]
  }, [locales, currentLocale])

  useEffect(() => {
    if (currentLocale) {
      const option = options.find(
        (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
      )
      setCurrent(option ?? DEFAULT_OPTION)
    } else {
      setCurrent(DEFAULT_OPTION)
    }
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      close()
      router.refresh()
    })
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          currentLocale
            ? options.find(
                (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
              ) ?? DEFAULT_OPTION
            : DEFAULT_OPTION
        }
        disabled={isPending}
      >
        <ListboxButton className="py-1 w-full">
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>Language:</span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                {current.countryCode && (
                  /* @ts-ignore */
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={current.countryCode}
                  />
                )}
                {isPending ? "..." : current.localizedName}
              </span>
            )}
          </div>
        </ListboxButton>
        <div className="flex relative w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute -bottom-[calc(100%-36px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full"
              static
            >
              {options.map((o) => (
                <ListboxOption
                  key={o.code || "default"}
                  value={o}
                  className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                >
                  {o.countryCode ? (
                    /* @ts-ignore */
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o.countryCode}
                    />
                  ) : (
                    <span style={{ width: "16px", height: "16px" }} />
                  )}
                  {o.localizedName}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
