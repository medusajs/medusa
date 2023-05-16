import { ProductDTO } from "./common"

export interface IProductService {
  list(): Promise<ProductDTO[]>
}
