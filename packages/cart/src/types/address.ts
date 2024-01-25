import { AbstractService } from "@medusajs/utils"
import { IAddressRepository } from "./repositories"
import { Address } from "@models"

export interface IAddressService<TEntity extends Address = Address>
  extends AbstractService<
    TEntity,
    {
      addressRepository: IAddressRepository<TEntity>
    },
    {
      create: CreateAddressDTO
      update: UpdateAddressDTO
    }
  > {}

export interface UpsertAddressDTO {
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface UpdateAddressDTO extends UpsertAddressDTO {
  id: string
}

export interface CreateAddressDTO extends UpsertAddressDTO {}
