import { ProductVariantService } from "@services"

export default class ProductService {
  protected readonly productVariantService: ProductVariantService
  constructor({ productVariantService }) {
    this.productVariantService = productVariantService
  }

  async listVariants() {
    return await this.productVariantService.list()
  }
}
