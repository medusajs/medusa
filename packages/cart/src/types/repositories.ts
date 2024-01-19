import { DAL } from "@medusajs/types"
import {
  Cart,
  LineItem,
  ShippingMethod,
  ShippingMethodAdjustment,
} from "@models"
import { CreateAddressDTO, UpdateAddressDTO } from "./address"
import { CreateCartDTO, UpdateCartDTO } from "./cart"
import { CreateLineItemDTO, UpdateLineItemDTO } from "./line-item"
import {
  CreateShippingMethodDTO,
  UpdateShippingMethodDTO,
} from "./shipping-method"
import {
  CreateShippingMethodAdjustmentDTO,
  UpdateShippingMethodAdjustmentDTO,
} from "./shipping-method-adjustment"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAddressRepository<TEntity extends Cart = Cart>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateAddressDTO
      update: UpdateAddressDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICartRepository<TEntity extends Cart = Cart>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateCartDTO
      update: UpdateCartDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILineItemRepository<TEntity extends LineItem = LineItem>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateLineItemDTO
      update: UpdateLineItemDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShippingMethodRepository<
  TEntity extends ShippingMethod = ShippingMethod
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateShippingMethodDTO
      update: UpdateShippingMethodDTO
    }
  > {}

export interface IShippingMethodAdjustmentRepository<
  TEntity extends ShippingMethodAdjustment = ShippingMethodAdjustment
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateShippingMethodAdjustmentDTO
      update: UpdateShippingMethodAdjustmentDTO
    }
  > {}
