"use client"

import { TriangleRightMini } from "@medusajs/icons"
import { Link, VerticalCodeTabs } from "docs-ui"
import { useState } from "react"

const HomepageCodeTabs = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const tabs = [
    {
      title: "Create Routes",
      textSection: {
        content:
          "Expose custom features with REST API routes, then consume them from your client applications.",
        link: {
          title: "API Routes",
          link: "/learn/basics/api-routes",
        },
      },
      code: {
        lang: "ts",
        source: `export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")

  const { data, metadata } = await query.graph({
    entity: "company",
    fields: ["id", "name"],
    filters: { name: "ACME" },
  })

  res.json({
    companies: data
  })
}`,
      },
    },
    {
      title: "Build Workflows",
      textSection: {
        content:
          "Build flows as a series of steps, with retry mechanisms and tracking of each steps' status.",
        link: {
          title: "Workflows",
          link: "/learn/basics/workflows",
        },
      },
      code: {
        lang: "ts",
        source: `export const handleDeliveryWorkflow = createWorkflow(
  "handle-delivery",
  function (input: WorkflowInput) {
    notifyRestaurantStep(input.delivery_id);

    awaitDriverClaimStep();

    const orderData = createOrderStep(input.delivery_id);

    createRemoteLinkStep(orderData.linkDef)

    awaitStartPreparationStep();

    awaitPreparationStep();

    createFulfillmentStep(orderData.order);

    awaitPickUpStep();

    awaitDeliveryStep();

    return new WorkflowResponse("Delivery completed");
  }
)`,
      },
    },
    {
      title: "Add a Data Model",
      textSection: {
        content:
          "Create data models that represent tables in the database using Medusa's Data Model Language.",
        link: {
          title: "DML",
          link: "/learn/basics/modules#1-create-data-model",
        },
      },
      code: {
        lang: "ts",
        source: `const DigitalProduct = model.define("digital_product", {
  id: model.id().primaryKey(),
  name: model.text(),
  medias: model.hasMany(() => DigitalProductMedia, {
    mappedBy: "digitalProduct"
  })
})
.cascades({
  delete: ["medias"]
})`,
      },
    },
    {
      title: "Build a Custom Module",
      textSection: {
        content:
          "Build custom modules with commerce or architectural features and use them in API routes or workflows.",
        link: {
          title: "Modules",
          link: "/learn/basics/modules",
        },
      },
      code: {
        lang: "ts",
        source: `class DigitalProductModuleService extends MedusaService({
  DigitalProduct,
}) {

}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const digitalProductModuleService = req.scope.resolve(
    "digitalProductModuleService"
  )

  const digitalProducts = await digitalProductModuleService
    .listDigitalProducts()

  res.json({ digital_products: digitalProducts })
}`,
      },
    },
    {
      title: "Extend Data Models",
      textSection: {
        content:
          "Add custom properties to Medusa's data models to build custom use cases.",
        link: {
          title: "Module Links",
          link: "/learn/advanced-development/module-links",
        },
      },
      code: {
        lang: "ts",
        source: `const DigitalProduct = model.define("digital_product", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default defineLink(
  DigitalProductModule.linkable.digitalProduct,
  ProductModule.linkable.productVariant
)`,
      },
    },
    {
      title: "Subscribe to Events",
      textSection: {
        content:
          "Handle events emitted by the Medusa application to perform custom actions.",
        link: {
          title: "Subscribers",
          link: "/learn/basics/events-and-subscribers",
        },
      },
      code: {
        lang: "ts",
        source: `export default async function orderPlaced({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificaitonModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const orderModuleService = container.resolve(
    Modules.ORDER
  )

  const order = await orderModuleService.retrieveOrder(
    data.id
  )

  await notificaitonModuleService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed"
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}`,
      },
    },
    {
      title: "Customize Admin",
      textSection: {
        content:
          "Inject widgets into predefined zones in the Medusa Admin, or add new pages.",
        link: {
          title: "Admin Customizations",
          link: "/learn/basics/admin-customizations",
        },
      },
      code: {
        lang: "tsx",
        source: `const ProductBrandWidget = () => {
  const [brand, setBrand] = useState({
    name: "Acme"
  })

  return (
    <Container>
      <Heading level="h2">Brand</Heading>
      {brand && <span>Name: {brand.name}</span>}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})`,
      },
    },
    {
      title: "Integrate Systems",
      textSection: {
        content:
          "Build workflows around multiple systems to add more powerful features to Medusa.",
        link: {
          title: "Integrate Systems",
          link: "/learn/customization/integrate-systems",
        },
      },
      code: {
        lang: "tsx",
        source: `const syncBrandsFromSystemWorkflow = createWorkflow(
  "sync-brands-from-system",
  () => {
    const { toCreate, toUpdate } = retrieveBrandsFromSystemStep()

    const created = createBrandsInMedusaStep({ 
      brands: toCreate
    })
    const updated = updateBrandsInMedusaStep({ 
      brands: toUpdate
    })

    return new WorkflowResponse({
      created,
      updated,
    })
  }
)`,
      },
    },
  ]

  return (
    <div className="row-span-2 pt-[56px] hidden lg:flex flex-col gap-1">
      <VerticalCodeTabs
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
        tabs={tabs}
        className="h-[443px]"
      />
      <div className="flex gap-[6px] items-center mx-0.5">
        <span className="text-medusa-fg-subtle text-small-plus">
          {tabs[selectedTabIndex].textSection.content}
        </span>
        <span className="text-medusa-fg-subtle text-small">&#183;</span>
        <Link
          href={tabs[selectedTabIndex].textSection.link.link}
          className="flex gap-0.25 items-center text-compact-small-plus"
        >
          <span>{tabs[selectedTabIndex].textSection.link.title}</span>
          <TriangleRightMini />
        </Link>
      </div>
    </div>
  )
}

export default HomepageCodeTabs
