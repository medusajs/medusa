import { ArrowUpDown } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

type DataTableOrderByProps<TData> = {
  keys: (keyof TData)[]
  prefix?: string
}

enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

type SortState = {
  key?: string
  dir: SortDirection
}

const initState = (params: URLSearchParams, prefix?: string): SortState => {
  const param = prefix ? `${prefix}_order` : "order"
  const sortParam = params.get(param)

  if (!sortParam) {
    return {
      dir: SortDirection.ASC,
    }
  }

  const dir = sortParam.startsWith("-") ? SortDirection.DESC : SortDirection.ASC
  const key = sortParam.replace("-", "")

  return {
    key,
    dir,
  }
}

const formatKey = (key: string) => {
  const words = key.split("_")
  const formattedWords = words.map((word, index) => {
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    } else {
      return word
    }
  })
  return formattedWords.join(" ")
}

export const DataTableOrderBy = <TData,>({
  keys,
  prefix,
}: DataTableOrderByProps<TData>) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<{
    key?: string
    dir: SortDirection
  }>(initState(searchParams, prefix))
  const param = prefix ? `${prefix}_order` : "order"
  const { t } = useTranslation()

  const handleDirChange = (dir: string) => {
    setState((prev) => ({
      ...prev,
      dir: dir as SortDirection,
    }))
    updateOrderParam({
      key: state.key,
      dir: dir as SortDirection,
    })
  }

  const handleKeyChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      key: value,
    }))

    updateOrderParam({
      key: value,
      dir: state.dir,
    })
  }

  const updateOrderParam = (state: SortState) => {
    if (!state.key) {
      setSearchParams((prev) => {
        prev.delete(param)
        return prev
      })

      return
    }

    const orderParam =
      state.dir === SortDirection.ASC ? state.key : `-${state.key}`
    setSearchParams((prev) => {
      prev.set(param, orderParam)
      return prev
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton size="small">
          <ArrowUpDown />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-[1]" align="end">
        <DropdownMenu.RadioGroup
          value={state.key}
          onValueChange={handleKeyChange}
        >
          {keys.map((key) => {
            const stringKey = String(key)

            return (
              <DropdownMenu.RadioItem
                key={stringKey}
                value={stringKey}
                onSelect={(event) => event.preventDefault()}
              >
                {formatKey(stringKey)}
              </DropdownMenu.RadioItem>
            )
          })}
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup
          value={state.dir}
          onValueChange={handleDirChange}
        >
          <DropdownMenu.RadioItem
            className="flex items-center justify-between"
            value="asc"
            onSelect={(event) => event.preventDefault()}
          >
            {t("general.ascending")}
            <DropdownMenu.Label>1 - 30</DropdownMenu.Label>
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem
            className="flex items-center justify-between"
            value="desc"
            onSelect={(event) => event.preventDefault()}
          >
            {t("general.descending")}
            <DropdownMenu.Label>30 - 1</DropdownMenu.Label>
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
