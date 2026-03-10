"use client"

import clsx from "clsx"
import {
  CodeBlock,
  CodeBlockProps,
  HeadlineTags,
  ShadedBlock,
  useMobile,
  useScrollController,
} from "docs-ui"
import React, { useLayoutEffect, useRef, useState } from "react"
import { HomepageHorizontalDottedSeparator } from "../DottedSeparator/Horizontal"
import HomepageEdges from "../Edges"

type Tab = {
  title: string
  code: CodeBlockProps
  textSection: {
    content: string
    link: {
      title: string
      link: string
    }
  }
}

const HomepageCodeTabs = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { isMobile } = useMobile()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { scrollableElement, getScrolledTop } = useScrollController()

  const handleTabClick = (index: number) => {
    setSelectedTabIndex(index)
  }

  useLayoutEffect(() => {
    if (!isMobile || !tabRefs.current[selectedTabIndex]) {
      return
    }
    const element = tabRefs.current[selectedTabIndex]
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const scrollTop = getScrolledTop()
      const offsetPosition = elementPosition + scrollTop - 52

      scrollableElement?.scrollTo({
        top: offsetPosition,
        behavior: "auto",
      })
    }
  }, [isMobile, selectedTabIndex, getScrolledTop, scrollableElement])

  const tabs: Tab[] = [
    {
      title: "Create API Route",
      textSection: {
        content:
          "Expose custom features with REST API routes, then consume them from your client applications.",
        link: {
          title: "API Routes",
          link: "/learn/fundamentals/api-routes",
        },
      },
      code: {
        lang: "ts",
        source: `export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
  ) {
    const query = req.scope.resolve("query")
  
    const { data } = await query.graph({
      entity: "company",
      fields: ["id", "name"],
      filters: { name: "ACME" },
    })
  
    res.json({
      companies: data
    })
  }`,
        highlights: [
          ["1", "GET", "Create a GET endpoint."],
          [
            "5",
            `query`,
            "use Query that retrieves data from a graph of\nall data models and their relations.",
          ],
          ["8", `"company"`, "Retrieve records of the `company` data model"],
          ["13", "res.json", "Return a JSON response"],
        ],
      },
    },
    {
      title: "Build Workflows",
      textSection: {
        content:
          "Build flows as a series of steps, with retry mechanisms and tracking of each steps' status.",
        link: {
          title: "Workflows",
          link: "/learn/fundamentals/workflows",
        },
      },
      code: {
        lang: "ts",
        source: `const handleDeliveryWorkflow = createWorkflow(
    "handle-delivery",
    function (input: WorkflowInput) {
      notifyRestaurantStep(input.delivery_id)
  
      const order = createOrderStep(input.delivery_id)
  
      createFulfillmentStep(order)
  
      awaitDeliveryStep()
  
      return new WorkflowResponse("Delivery completed")
    }
  )`,
        highlights: [
          [
            "1",
            "createWorkflow",
            "Use the Workflows SDK to build a flow of a series of steps.",
          ],
          ["4", "notifyRestaurantStep", "Run steps in the worklfow"],
          [
            "10",
            "awaitDeliveryStep",
            "Wait for background actions to finish execution\nbefore performing some steps.",
          ],
        ],
      },
    },
    {
      title: "Add a Data Model",
      textSection: {
        content:
          "Create data models that represent tables in the database using Medusa's Data Model Language.",
        link: {
          title: "DML",
          link: "/learn/fundamentals/modules#1-create-data-model",
        },
      },
      code: {
        lang: "ts",
        source: `const DigitalProduct = model.define("digital_product", 
  {
    id: model.id().primaryKey(),
    name: model.text(),
    medias: model.hasMany(() => DigitalProductMedia, {
      mappedBy: "digitalProduct"
    })
  })
  .cascades({
    delete: ["medias"]
  })`,
        highlights: [
          [
            "1",
            "model",
            "Use Medusa's Data Model Language to\nrepresent custom tables in the database.",
          ],
          [
            "4",
            "hasMany",
            "Create relations between models of the same module.",
          ],
        ],
      },
    },
    {
      title: "Build a Custom Module",
      textSection: {
        content:
          "Build custom modules with commerce or architectural features and use them in API routes or workflows.",
        link: {
          title: "Modules",
          link: "/learn/fundamentals/modules",
        },
      },
      code: {
        lang: "ts",
        source: `class DigitalProductService extends MedusaService({
    DigitalProduct,
  }) {
    async authorizeLicense() {
      console.log("License authorized!")
    }
  }
  
  export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
  ) {
    const moduleService = req.scope.resolve(
      "digitalProduct"
    )
  
    await moduleService.authorizeLicense()
  
    res.json({ success: true })
  }`,
        highlights: [
          [
            "1",
            "DigitalProductModuleService",
            "Create a service that accesses\nthe database to manage data models.",
          ],
          [
            "1",
            "MedusaService",
            "Generate data-management methods\nfor your data models automatically.",
          ],
          [
            "13",
            "digitalProductModuleService",
            "Resolve the database from the Medusa container\nin routes and other resources.",
          ],
          ["17", "authorizeLicense", "Use the service's custom methods."],
        ],
      },
    },
    {
      title: "Link Data Models",
      textSection: {
        content:
          "Add custom properties to Medusa's data models using module links to build custom use cases.",
        link: {
          title: "Module Links",
          link: "/learn/fundamentals/module-links",
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
        highlights: [
          [
            "6",
            "defineLink",
            "Create a link between data models of different modules.",
          ],
        ],
      },
    },
    {
      title: "Subscribe to Events",
      textSection: {
        content:
          "Handle events emitted by the Medusa application to perform custom actions.",
        link: {
          title: "Subscribers",
          link: "/learn/fundamentals/events-and-subscribers",
        },
      },
      code: {
        lang: "ts",
        source: `async function orderPlaced({
    container,
  }: SubscriberArgs) {
    const moduleService = container.resolve(
      Modules.NOTIFICATION
    )
  
    await moduleService.createNotifications({
      to: "customer@gmail.com",
      channel: "email",
      template: "order-placed"
    })
  }
  
  export const config: SubscriberConfig = {
    event: "order.placed",
  }`,
        highlights: [
          [
            "1",
            "orderPlaced",
            "Define a subscriber that's\nexecuted when an event is emitted.",
          ],
          [
            "4",
            "notificationModuleService",
            "Resolve a module's main service\nto use its methods.",
          ],
          ["8", "createNotification", "Send an email to a customer."],
          [
            "16",
            `"order.placed"`,
            "Execute the subscriber when an order is placed.",
          ],
        ],
      },
    },
    {
      title: "Customize Admin",
      textSection: {
        content:
          "Inject widgets into predefined zones in the Medusa Admin, or add new pages.",
        link: {
          title: "Admin Widgets",
          link: "/learn/fundamentals/admin/widgets",
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
        highlights: [
          [
            "1",
            "ProductBrandWidget",
            "Create admin widgets as React components.",
          ],
          [
            "7",
            "Container",
            "Use Medusa's UI components in your customizations.",
          ],
          [
            "15",
            `"product.details.before"`,
            "Show the widget on the product details page.",
          ],
        ],
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
      const toCreate = retrieveBrandsFromSystemStep()
  
      const created = createBrandsInMedusaStep({ 
        brands: toCreate
      })
  
      return new WorkflowResponse({
        created,
      })
    }
  )`,
        highlights: [
          ["1", "createWorkflow", "Integrate systems using workflows."],
          [
            "4",
            "retrieveBrandsFromSystemStep",
            "Retrieve data from an external system.",
          ],
          ["6", "createBrandsInMedusaStep", "Sync data to Medusa."],
        ],
      },
    },
  ]

  return (
    <div
      className={clsx(
        "w-full border-b border-medusa-border-base",
        "flex gap-0 flex-col lg:flex-row"
      )}
    >
      <div className="w-full lg:w-1/2 flex flex-col gap-0 border-r border-medusa-border-base">
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <button
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              className={clsx(
                "px-2 py-1.5 appearance-none text-left",
                "flex flex-col gap-0.5 group"
              )}
              onClick={() => handleTabClick(index)}
            >
              <div className="flex items-center gap-0.5">
                <span
                  className={clsx(
                    "text-code-label group-hover:text-medusa-fg-interactive",
                    index === selectedTabIndex && "text-medusa-fg-interactive",
                    index !== selectedTabIndex && "text-medusa-fg-subtle"
                  )}
                >
                  [ {index + 1} ]
                </span>
                <span className="text-medium-plus text-medusa-fg-base">
                  {tab.title}
                </span>
              </div>
              {index === selectedTabIndex && (
                <p className="text-medusa-fg-subtle text-medium">
                  {tab.textSection.content}
                </p>
              )}
            </button>
            {index !== tabs.length - 1 && <HomepageHorizontalDottedSeparator />}
            {isMobile && index === selectedTabIndex && (
              <>
                <CodeSection tab={tab} />
                <HomepageHorizontalDottedSeparator />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
      {!isMobile && <CodeSection tab={tabs[selectedTabIndex]} />}
    </div>
  )
}

export default HomepageCodeTabs

type CodeSectionProps = {
  tab: Tab
}

const CodeSection = ({ tab }: CodeSectionProps) => {
  return (
    <div
      className={clsx(
        "w-full lg:w-1/2 p-2 flex flex-col gap-2 justify-center bg-medusa-bg-component relative"
      )}
    >
      <ShadedBlock className="!h-2" />
      <CodeBlock
        {...tab.code}
        noCopy={true}
        noReport={true}
        noAskAi={true}
        forceNoTitle={true}
        wrapperClassName="h-full !rounded-none"
        className={clsx("overflow-auto h-full max-h-full !mb-0 !rounded-none")}
        innerClassName="h-full"
        animateTokenHighlights
        blockStyle="subtle"
      />
      <ShadedBlock className="!h-2" />
      <HeadlineTags
        tags={[
          tab.textSection.link.title,
          {
            text: "Learn more",
            link: tab.textSection.link.link,
          },
        ]}
      />
      <HomepageEdges />
    </div>
  )
}
