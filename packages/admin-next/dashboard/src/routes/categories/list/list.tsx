import { Container, Heading } from "@medusajs/ui"

// import after from "medusa-admin:widgets/product_category/list/after"
// import before from "medusa-admin:widgets/product_category/list/before"

export const CategoriesList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {/* {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })} */}

      <Container>
        <Heading>Categories</Heading>
      </Container>

      {/* {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })} */}
    </div>
  )
}
