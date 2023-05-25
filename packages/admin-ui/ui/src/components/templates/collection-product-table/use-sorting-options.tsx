import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FilteringOptionProps } from "../../molecules/table/filtering-option"
import { SimpleProductType } from "./utils"

// TODO: Redo this with server side sorting

const useSortingOptions = (products: SimpleProductType[]) => {
  const { t } = useTranslation()
  const [options, setOptions] = useState<FilteringOptionProps[]>([])
  const [sortedProducts, setSortedProducts] =
    useState<SimpleProductType[]>(products)

  const sortByTitle = (a: SimpleProductType, b: SimpleProductType) => {
    if (a.title < b.title) {
      return -1
    }
    if (a.title > b.title) {
      return 1
    }
    return 0
  }

  const sortByNewest = (a: SimpleProductType, b: SimpleProductType) => {
    if (a.created_at < b.created_at) {
      return -1
    }
    if (a.created_at > b.created_at) {
      return 1
    }
    return 0
  }

  const sortByOldest = (a: SimpleProductType, b: SimpleProductType) => {
    if (a.created_at > b.created_at) {
      return -1
    }
    if (a.created_at < b.created_at) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    setOptions([
      {
        title: t("Sort by"),
        options: [
          {
            title: t("All"),
            onClick: () => {
              setSortedProducts(products)
            },
          },
          {
            title: t("Newest"),
            onClick: () => {
              const sorted = products.sort(sortByNewest)
              console.log(sorted)
              setSortedProducts(sorted)
            },
          },
          {
            title: t("Oldest"),
            onClick: () => {
              const sorted = products.sort(sortByOldest)
              console.log(sorted)
              setSortedProducts(sorted)
            },
          },
          {
            title: t("Title"),
            onClick: () => {
              const sorted = products.sort(sortByTitle)
              console.log(sorted)
              setSortedProducts(sorted)
            },
          },
        ],
      },
    ])

    setSortedProducts(products)
  }, [products])

  return [sortedProducts, options]
}

export default useSortingOptions
