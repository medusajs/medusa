import {
  StoreCustomersRes,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from "@medusajs/medusa"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"

export const useCreateCustomer = (
  options?: UseMutationOptions<StoreCustomersRes, Error, StorePostCustomersReq>
) => {
  const { client } = useMedusa()
  return useMutation(
    (data: StorePostCustomersReq) => client.customers.create(data),
    options
  )
}

export const useUpdateMe = (
  options?: UseMutationOptions<
    StoreCustomersRes,
    Error,
    { id: string } & StorePostCustomersCustomerReq
  >
) => {
  const { client } = useMedusa()
  return useMutation(
    ({ id, ...data }: { id: string } & StorePostCustomersCustomerReq) =>
      client.customers.update(data),
    options
  )
}
