import { NextFunction, Request, Response } from "express"
import { ProductService } from "../../../services"
import { ProductBatchSalesChannel } from "../../../types/sales-channels"

export function validateProductsExist(
  getProducts: (req) => ProductBatchSalesChannel[] | undefined
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const products = getProducts(req)

    if (!products?.length) {
      return next()
    }

    const productService: ProductService = req.scope.resolve("productService")

    const productIds = products.map((product) => product.id)
    const [existingProducts] = await productService.listAndCount({
      id: productIds,
    })

    const nonExistingProducts = productIds.filter(
      (scId) => existingProducts.findIndex((sc) => sc.id === scId) === -1
    )

    if (nonExistingProducts.length) {
      req.errors = req.errors ?? []
      req.errors.push(`Products ${nonExistingProducts.join(", ")} do not exist`)
    }

    return next()
  }
}
