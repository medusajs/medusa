import { NextFunction, Request, Response } from "express"

type GetProductsRequiredParams = {
  id: string
}

export function validateProductsExist<T extends GetProductsRequiredParams = GetProductsRequiredParams>(
  getProducts: (req) => T[]
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestedProducts = getProducts(req)

    if (!requestedProducts?.length) {
      return next()
    }

    const productService = req.scope.resolve("productService")
    const requestedProductIds = requestedProducts.map((product) => product.id)
    const [productRecords] = await productService.listAndCount({
      id: requestedProductIds,
    })

    const nonExistingProducts = requestedProductIds.filter(
      (requestedProductId) =>
        productRecords.findIndex(
          (productRecord) => productRecord.id === requestedProductId
        ) === -1
    )

    if (nonExistingProducts.length) {
      req.errors = req.errors ?? []
      req.errors.push(`Products ${nonExistingProducts.join(", ")} do not exist`)
    }

    return next()
  }
}
