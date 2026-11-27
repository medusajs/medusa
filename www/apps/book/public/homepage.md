# Medusa

> Medusa is a digital commerce platform with a built-in Framework for customization. When you install Medusa, you get a fully fledged commerce platform with all the features you need to get off the ground. However, unlike other platforms, Medusa is built with customization in mind. You don't need to build hacky workarounds that are difficult to maintain and scale. Your efforts go into building features that bring your business's vision to life.

> For the complete documentation index, see [llms.txt](/llms.txt)

> To learn how to navigate the docs and which tools agents can use, see [SKILL.md](/SKILL.md)

Get Started with Medusa, the Agent-Native Commerce Platform.

## Get Started with Your AI Agent

Use this prompt with any AI agent to install and deploy a Medusa-powered ecommerce store.

```
Fetch https://docs.medusajs.com/start and create an ecommerce store with Medusa Cloud
```

- [Learn more](https://docs.medusajs.com/start): Get started with Medusa using an AI agent.

## Docs Assistant

Hello! I'm the Docs Assistant. How can I help you?

Ask anything about Medusa...

### FAQ

- What is Medusa?
- How can I build with Medusa and AI agents?
- How can I extend the product data model?
- How to create an admin user?
- How do I deploy Medusa to production?

### Recipes

- How do I build a marketplace?
- How do I build digital products?
- How do I build subscription-based purchases?
- What other recipes are available?

## Get Started

- [Sign up](https://docs.medusajs.com/cloud/sign-up): Create a Medusa Cloud account.
- [Create your first project](https://docs.medusajs.com/cloud/first-project): Create and deploy your first Medusa project.
- [Go live](https://docs.medusajs.com/cloud/going-live): Take your store live in production.

## Medusa Cloud Resources

- [Storefront](https://docs.medusajs.com/cloud/storefront): Deploy and manage your storefront on Medusa Cloud.
- [Search](https://docs.medusajs.com/cloud/search): Add product search with Medusa Search.
- [Emails](https://docs.medusajs.com/cloud/emails): Send transactional emails with Medusa Emails.

## Build with Agents

- [Medusa MCP](https://docs.medusajs.com/cloud/ai-toolkit/medusa-mcp): Connect AI agents to your Medusa Cloud projects and stores.
- [Agent Skills](https://docs.medusajs.com/cloud/ai-toolkit/agent-skills): Teach AI agents how to build with Medusa.
- [Cloud CLI](https://docs.medusajs.com/cloud/cli): Manage Medusa Cloud from the terminal.

## Agent Tools for the Docs

- [Docs SKILL.md](https://docs.medusajs.com/SKILL.md): How to navigate the docs, where to find what, and which tools agents can use.
- [Docs retrieval endpoint](https://docs.medusajs.com/agents/ask?q=how+to+create+a+workflow&source=docs-homepage): Search the docs and get the most relevant content. Pass your question in the `q` query parameter, and your name, such as `Claude Code`, in the `agent` query parameter.
- [Docs MCP server](https://docs.medusajs.com/cloud/ai-toolkit/docs-mcp): Connect AI agents and IDEs to the docs at `https://docs.medusajs.com/mcp`. Requires signing in with a Medusa account.
- [WebMCP tools](https://docs.medusajs.com/cloud/ai-toolkit/ai-friendly-docs#webmcp-tools): Search, read, and navigate the docs from a browser that supports WebMCP.
- [AI-friendly docs](https://docs.medusajs.com/cloud/ai-toolkit/ai-friendly-docs): All the ways agents can read the docs, including Markdown pages and `llms.txt`.
- [AI catalog](https://docs.medusajs.com/.well-known/ai-catalog.json): Machine-readable catalog of all agent-facing resources.

## Customize Medusa

- [Learn the Framework](https://docs.medusajs.com/learn): Build custom features with the Medusa Framework.
- [Add integrations](https://docs.medusajs.com/cloud/integrations): Integrate third-party services with Medusa.
- [Extend the Admin](https://docs.medusajs.com/learn/fundamentals/admin): Add widgets and pages to the Medusa Admin.

## Storefront Development

- [Explore storefront starter](https://docs.medusajs.com/resources/nextjs-starter): Next.js storefront starter template.
- [Build custom storefront](https://docs.medusajs.com/resources/storefront-development): Build storefronts with Medusa.
- [Use agent skills](https://docs.medusajs.com/cloud/ai-toolkit/agent-skills#ecommerce-storefront-best-practices): Best practices for storefront development with AI agents.

## Medusa Cloud

Everything your store needs to go live, managed for you. Explore the features and resources that come with a Medusa Cloud project.

- [Learn more about Medusa Cloud](https://docs.medusajs.com/cloud): Overview of Medusa Cloud.
- [Deployments](https://docs.medusajs.com/cloud/deployments): Push to GitHub and go live. Every commit builds and deploys automatically.
- [Preview environments](https://docs.medusajs.com/cloud/environments/preview): Every pull request gets its own live environment, so you can review changes before they ship.
- [Managed resources](https://docs.medusajs.com/cloud/features#managed-resources-and-services): Postgres, Redis, S3, and caching, set up for every project. No servers to manage.
- [Medusa Search](https://docs.medusajs.com/cloud/search): Help customers find the right product fast with full-text and semantic search.
- [Medusa Emails](https://docs.medusajs.com/cloud/emails): Send order confirmations and password resets out of the box, with no email provider to set up.
- [Monitoring](https://docs.medusajs.com/cloud/monitoring): See logs, performance, and usage for every environment, and catch issues before customers do.
- [Enterprise security](https://docs.medusajs.com/cloud/enterprise): Control who can do what with role-based access, and let your team sign in with SSO.

## Framework

A digital commerce platform with a built-in framework for customizations. Unlike other platforms, the Medusa Framework allows you to easily customize and extend the behavior of your commerce platform to always fit your business needs.

- [Learn more about the Framework](https://docs.medusajs.com/learn/fundamentals/framework): Overview of Medusa's Framework and concepts.

### Create API Route

Expose custom features with REST API routes, then consume them from your client applications.

```ts
export async function GET(
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
}
```

- [API Routes](https://docs.medusajs.com/learn/fundamentals/api-routes): Learn more about API routes.

### Build Workflows

Build flows as a series of steps, with retry mechanisms and tracking of each steps' status.

```ts
const handleDeliveryWorkflow = createWorkflow(
  "handle-delivery",
  function (input: WorkflowInput) {
    notifyRestaurantStep(input.delivery_id)

    const order = createOrderStep(input.delivery_id)

    createFulfillmentStep(order)

    awaitDeliveryStep()

    return new WorkflowResponse("Delivery completed")
  }
)
```

- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows): Learn more about workflows.

### Add a Data Model

Create data models that represent tables in the database using Medusa's Data Model Language.

```ts
const DigitalProduct = model.define("digital_product",
  {
    id: model.id().primaryKey(),
    name: model.text(),
    medias: model.hasMany(() => DigitalProductMedia, {
      mappedBy: "digitalProduct"
    })
  })
  .cascades({
    delete: ["medias"]
  })
```

- [DML](https://docs.medusajs.com/learn/fundamentals/modules#1-create-data-model): Learn more about data models.

### Build a Custom Module

Build custom modules with commerce or architectural features and use them in API routes or workflows.

```ts
class DigitalProductService extends MedusaService({
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
}
```

- [Modules](https://docs.medusajs.com/learn/fundamentals/modules): Learn more about modules.

### Link Data Models

Add custom properties to Medusa's data models using module links to build custom use cases.

```ts
const DigitalProduct = model.define("digital_product", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default defineLink(
  DigitalProductModule.linkable.digitalProduct,
  ProductModule.linkable.productVariant
)
```

- [Module Links](https://docs.medusajs.com/learn/fundamentals/module-links): Learn more about module links.

### Subscribe to Events

Handle events emitted by the Medusa application to perform custom actions.

```ts
async function orderPlaced({
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
}
```

- [Subscribers](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers): Learn more about events and subscribers.

### Customize Admin

Inject widgets into predefined zones in the Medusa Admin, or add new pages.

```tsx
const ProductBrandWidget = () => {
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
})
```

- [Admin Widgets](https://docs.medusajs.com/learn/fundamentals/admin/widgets): Learn more about admin widgets.

### Integrate Systems

Build workflows around multiple systems to add more powerful features to Medusa.

```tsx
const syncBrandsFromSystemWorkflow = createWorkflow(
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
)
```

- [Integrate Systems](https://docs.medusajs.com/learn/customization/integrate-systems): Learn more about integrating systems.

## Recipes

Medusa's framework supports any business use case. These recipes show you how to build a use case by customizing and extending existing data models and features, or creating new ones.

- [Marketplace](https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors): Build a marketplace with multiple vendors.
- [ERP](https://docs.medusajs.com/resources/recipes/erp): Integrate an ERP system to manage custom product prices, purchase rules, syncing orders, and more.
- [Bundled Products](https://docs.medusajs.com/resources/recipes/bundled-products/examples/standard): Sell products as bundles with Admin and storefront customizations.
- [Subscriptions](https://docs.medusajs.com/resources/recipes/subscriptions/examples/standard): Implement a subscription-based commerce store.
- [Restaurant-Delivery](https://docs.medusajs.com/resources/recipes/marketplace/examples/restaurant-delivery): Build a restaurant marketplace inspired by UberEats, with real-time delivery handling.
- [Digital Products](https://docs.medusajs.com/resources/recipes/digital-products/examples/standard): Sell digital products with custom fulfillment.
- [View all recipes](https://docs.medusajs.com/resources/recipes): Browse all Medusa recipes.

## Commerce Modules

### Cart & Purchase

- [Cart](https://docs.medusajs.com/resources/commerce-modules/cart): Add to cart, checkout, and totals.
- [Payment](https://docs.medusajs.com/resources/commerce-modules/payment): Process any payment type.
- [Customer](https://docs.medusajs.com/resources/commerce-modules/customer): Customer and group management.

### Merchandising

- [Pricing](https://docs.medusajs.com/resources/commerce-modules/pricing): Configurable pricing engine.
- [Promotion](https://docs.medusajs.com/resources/commerce-modules/promotion): Discounts and promotions.
- [Product](https://docs.medusajs.com/resources/commerce-modules/product): Variants, categories, and bulk edits.

### Fulfillment

- [Order](https://docs.medusajs.com/resources/commerce-modules/order): Omnichannel order management.
- [Inventory](https://docs.medusajs.com/resources/commerce-modules/inventory): Multi-warehouse and reservations.
- [Fulfillment](https://docs.medusajs.com/resources/commerce-modules/fulfillment): Order fulfillment and shipping.
- [Stock Location](https://docs.medusajs.com/resources/commerce-modules/stock-location): Locations of stock-kept items.

### Regions & Channels

- [Region](https://docs.medusajs.com/resources/commerce-modules/region): Cross-border commerce.
- [Sales Channel](https://docs.medusajs.com/resources/commerce-modules/sales-channel): Omnichannel sales.
- [Tax](https://docs.medusajs.com/resources/commerce-modules/tax): Granular tax control.
- [Currency](https://docs.medusajs.com/resources/commerce-modules/currency): Multi-currency support.

### User Access

- [API Keys](https://docs.medusajs.com/resources/commerce-modules/api-key): Store and admin access.
- [User Module](https://docs.medusajs.com/resources/commerce-modules/user): Admin user management.
- [Auth](https://docs.medusajs.com/resources/commerce-modules/auth): Integrate authentication methods.

## Newsletter

Updates delivered monthly. Get the latest product news and behind the scenes updates. Unsubscribe at any time.

## Feedback

Was this page helpful?
