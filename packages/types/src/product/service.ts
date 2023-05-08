// TODO: -> this is defined in the module that is using this interface(circular dep.)
// TODO: -> how do we define return type here
type IProduct = {}

export interface IProductService {
  list(): Promise<IProduct>
}
