import { ProductService } from "../../../../services"

export default async (req, res) => {
  const productService: ProductService = req.scope.resolve(ServiceIdentifiers.productService)

  const tags = await productService.listTagsByUsage()

  res.json({ tags })
}
