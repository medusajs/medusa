import { TFunction } from "i18next"

export function getIsActiveProps(
  isActive: boolean,
  t: TFunction
): { color: "green" | "red"; label: string } {
  switch (isActive) {
    case true:
      return {
        label: t("categories.fields.active"),
        color: "green",
      }
    case false:
      return {
        label: t("categories.fields.inactive"),
        color: "red",
      }
  }
}

export function getIsInternalProps(
  isInternal: boolean,
  t: TFunction
): { color: "blue" | "green"; label: string } {
  switch (isInternal) {
    case true:
      return {
        label: t("categories.fields.internal"),
        color: "blue",
      }
    case false:
      return {
        label: t("categories.fields.public"),
        color: "green",
      }
  }
}
