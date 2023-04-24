import { FC } from "react"
import { Product } from "@medusajs/medusa"
import Table from "../../../../../../../../../../components/molecules/table"

export interface ProductListTableProps {
  products: Product[]
}

export const ProductListTable: FC<ProductListTableProps> = ({ products }) => {
  if (!products.length)
    return <div>No products matched your filter selection</div>

  return (
    <Table>
      <Table.Head>
        <Table.HeadRow>
          <Table.HeadCell colSpan={2}>Name</Table.HeadCell>
          <Table.HeadCell>Collection</Table.HeadCell>
        </Table.HeadRow>
      </Table.Head>
      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.id}>
            <Table.Cell className="w-[0%] pr-base">
              <div className="h-[40px] w-[30px] bg-grey-5 rounded-soft overflow-hidden my-xsmall">
                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </Table.Cell>
            <Table.Cell className="w-[15%]">
              <div className="p-xsmall">{product.title}</div>
            </Table.Cell>
            <Table.Cell className="w-[25%]">
              {product.collection?.title || ""}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
