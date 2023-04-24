import { AxiosResponse, AxiosError } from "axios"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export interface Package {
  id: string
  vendor_id: string
  package_name: string
  package_type: PackageType
  length: number
  width: number
  height?: number
  empty_weight?: number
  carrier_code?: string
  package_code?: string
  inventory_managed: boolean
  use_in_estimates: boolean
}

export enum PackageType {
  BOX = "box",
  ENVELOPE = "envelope",
  SOFT_PACKAGE = "soft_package",
}

export enum CarrierType {
  FEDEX = "fedex",
  USPS = "usps",
  UPS = "ups",
}

export enum PackageCategoryType {
  CUSTOM = "custom",
  CARRIER = "carrier",
}

export const useAdminCreatePackage = (vendorId: string) => {
  const path = `/admin/vendors/${vendorId}/packages`

  return useMutation<AxiosResponse<Package>, AxiosError, Omit<Package, "id">>(
    (payload: Omit<Package, "id">) =>
      medusaRequest<Package>("POST", path, payload)
  )
}

export const useAdminUpdatePackage = (vendorId, packageId) => {
  const path = `/admin/vendors/${vendorId}/packages/${packageId}`

  return useMutation<
    AxiosResponse<Package>,
    AxiosError,
    Partial<Omit<Package, "id">>
  >((payload: Partial<Omit<Package, "id">>) =>
    medusaRequest<Package>("POST", path, payload)
  )
}

export const useAdminDeletePackage = (vendorId: string) => {
  return useMutation<AxiosResponse, AxiosError, { id: string }>(
    ({ id }: { id: string }) =>
      medusaRequest("DELETE", `/admin/vendors/${vendorId}/packages/${id}`)
  )
}
