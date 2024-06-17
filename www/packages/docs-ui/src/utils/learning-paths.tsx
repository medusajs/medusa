import React from "react"
import { LearningPathType } from "../providers/LearningPath"
import { Link } from "@/components"

const paths: LearningPathType[] = [
  {
    name: "simple-quickstart",
    label: "Start Selling in 3 Steps",
    description: "Create and deploy a full-fledged ecommerce store.",
    steps: [
      {
        title: "Create a Next.js Starter Template",
        description:
          "Create a Next.js Starter Template and connect it to your Medusa backend.",
        path: "#",
      },
      {
        title: "Deploy the backend",
        path: "#",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
      {
        title: "Deploy the storefront",
        description: "Deploy your storefront to your preferred hosting.",
        path: "#",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building your store!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_simple-quickstart",
      },
    },
  },
  {
    name: "marketplace",
    label: "Build a marketplace",
    description:
      "Customize the backend and handle events to build a marketplace.",
    steps: [
      {
        title: "Extend entities",
        descriptionJSX: (
          <>
            Extend entities, such as <code>User</code> or <code>Product</code>{" "}
            entities, to associate them with the <code>Store</code> entity.
          </>
        ),
        path: "/development/entities/extend-entity",
      },
      {
        title: "Access logged-in user",
        description:
          "Create a middleware that registers the logged-in user in the dependency container.",
        path: "/development/api-routes/example-logged-in-user",
      },
      {
        title: "Extend services",
        descriptionJSX: (
          <>
            Extend services, such as <code>ProductService</code> to customize
            data management functionalities
          </>
        ),
        path: "/development/services/extend-service",
      },
      {
        title: "Handle events",
        descriptionJSX: (
          <>
            Listen to events like <code>order.placed</code> and handle them with
            subscribers
          </>
        ),
        path: "/development/events/create-subscriber",
      },
      {
        title: "Add Payment Provider",
        path: "/plugins/payment",
        descriptionJSX: (
          <>
            Add a payment provider to your Medusa backend. You can choose to
            install a plugin or{" "}
            <Link href="/modules/carts-and-checkout/backend/add-payment-provider">
              create your own provider
            </Link>
            .
          </>
        ),
      },
      {
        title: "Customize Admin",
        path: "/admin/widgets",
        descriptionJSX: (
          <>
            As you add marketplace features to your store, you&apos;ll most
            likely need to customize the admin to provide an interface to manage
            these features.
            <br />
            You can extend the admin plugin to add widgets,{" "}
            <Link href="/admin/routes">UI routes</Link>, or{" "}
            <Link href="/admin/setting-pages">setting pages</Link>.
          </>
        ),
      },
      {
        title: "Implement Role-Based Access Control",
        path: "/modules/users/backend/rbac",
        description:
          "In your marketplace, you may need to implement role-based access control (RBAC) within stores. This will restrict some users' permissions to specified functionalities or API Routes.",
      },
      {
        title: "Create a storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js Starter Template or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        title: "Deploy the backend",
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building your marketplace!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_marketplace",
      },
    },
  },
  {
    name: "subscriptions",
    label: "Build Subscription-based Purchases",
    description:
      "Customize the backend and handle events to implement subscriptions",
    steps: [
      {
        title: "Extend entities",
        path: "/development/entities/extend-entity",
        descriptionJSX: (
          <>
            Extend entities, such as the <code>Order</code> entity, to associate
            them with the <code>Store</code> entity. You can also{" "}
            <Link href="/development/entities/create">
              Create a custom entity
            </Link>
            .
          </>
        ),
      },
      {
        title: "Handle events",
        descriptionJSX: (
          <>
            Create a subscriber that listens to the <code>order.placed</code>{" "}
            event, or other{" "}
            <Link href="/development/events/events-list">events</Link>, and
            handles creating the subscription in Medusa.
          </>
        ),
        path: "/development/events/create-subscriber",
      },
      {
        title: "Create a Scheduled Job",
        description:
          "Create a scheduled job that checks daily for subscriptions that needs renewal.",
        path: "/development/scheduled-jobs/create",
      },
      {
        title: "Customize Admin",
        path: "/admin/widgets",
        descriptionJSX: (
          <>
            As you add subscription features to your store, you may need to
            customize the admin to provide an interface to manage these
            features.
            <br />
            You can extend the admin plugin to add widgets,{" "}
            <Link href="/admin/routes">UI routes</Link>, or{" "}
            <Link href="/admin/setting-pages">setting pages</Link>.
          </>
        ),
      },
      {
        title: "Create a storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            Build a storefront either using the Next.js Starter Template or{" "}
            <Link href="/storefront/roadmap">from scratch</Link>.
          </>
        ),
      },
      {
        title: "Deploy the backend",
        path: "/deployments/server/deploying-on-railway",
        descriptionJSX: (
          <>
            Deploy your backend to Railway. You can alternatively check out{" "}
            <Link href="/deployments/server">other deployment guides</Link>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on implementing subscription-based purchases!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_subscriptions",
      },
    },
  },
  {
    name: "b2b",
    label: "Build a B2B store",
    description:
      "Utilize Medusa's features and customization capabilities to build a B2B store.",
    steps: [
      {
        title: "Create a B2B Sales Channel",
        path: "/user-guide/sales-channels/manage",
        descriptionJSX: (
          <>
            You can create a B2B sales channel that will include only your
            wholesale products.
            <br />
            You can either use the Medusa admin, or the{" "}
            <Link href="/modules/sales-channels/admin/manage">
              Admin REST APIs
            </Link>
            .
          </>
        ),
      },
      {
        title: "Create a Publishable API Key",
        path: "/user-guide/settings/publishable-api-keys",
        descriptionJSX: (
          <>
            Publishable API keys can be associated with one or more sales
            channels. You can then use the publishable API key in your
            storefront or client.
            <br />
            You can either use the Medusa admin, or the{" "}
            <Link href="/development/publishable-api-keys/admin/manage-publishable-api-keys">
              Admin REST APIs
            </Link>
            .
          </>
        ),
      },
      {
        title: "Add Wholesale Products",
        path: "/user-guide/products/manage",
        descriptionJSX: (
          <>
            You can add your wholesale products and make them only available in
            the B2B sales channel.
            <br />
            You can use the Medusa admin to add the products. Other alternatives
            are:
            <ul>
              <li>
                <Link href="/modules/products/admin/manage-products">
                  Add Products Using REST APIs
                </Link>
              </li>
              <li>
                <Link href="/user-guide/products/import">
                  Import Products Using Medusa Admin
                </Link>
              </li>
              <li>
                <Link href="/modules/products/admin/import-products">
                  Import Products Using REST APIs
                </Link>
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "Create a B2B Customer Group",
        path: "/user-guide/customers/groups",
        descriptionJSX: (
          <>
            Customer groups can be used to apply different prices for different
            subsets of customers, in this case B2B customers.
            <br />
            You can either use the Medusa admin, or the{" "}
            <Link href="/modules/customers/admin/manage-customer-groups">
              Admin REST APIs
            </Link>
            .
          </>
        ),
      },
      {
        title: "Add B2B Customers",
        path: "/user-guide/customers/manage",
        descriptionJSX: (
          <>
            You can now add B2B customers and assign them to the B2B customer
            group. Alternatively, if you want to allow B2B customers to register
            themselves, you can implement that logic within your storefront.
            <br />
            You can either use the Medusa admin, or the{" "}
            <Link href="/modules/customers/admin/manage-customers">
              Admin REST APIs
            </Link>
            .
          </>
        ),
      },
      {
        title: "Create B2B Price Lists",
        path: "/user-guide/price-lists/manage",
        descriptionJSX: (
          <>
            A price list allows you to set different prices on a set of products
            for different conditions. You can use this when building a B2B store
            to assign different prices for B2B customer groups.
            <br />
            You can use the Medusa admin to add the price list. Other
            alternatives are:
            <ul>
              <li>
                <Link href="/modules/price-lists/admin/manage-price-lists">
                  Add Price List Using REST APIs
                </Link>
              </li>
              <li>
                <Link href="/user-guide/price-lists/import">
                  Import Prices Using Medusa Admin
                </Link>
              </li>
              <li>
                <Link href="/modules/price-lists/admin/import-prices">
                  Import Prices Using REST APIs
                </Link>
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "Create Custom Entities",
        path: "/development/entities/create",
        descriptionJSX: (
          <>
            Your use case may be more elaborate than what is shown in this
            recipe.
            <br />
            Medusa can be customized to add custom entities, API Routes,
            services, and more.
            <br />
            You can find additional development resources in the{" "}
            <Link href="/development/overview">Medusa development section</Link>
            .
          </>
        ),
      },
      {
        title: "Create an API Route to Check Customers",
        path: "/development/entities/create",
        descriptionJSX: (
          <>
            On the clients communicating with your store, such as the
            storefront, you’ll need to check if the currently logged-in customer
            is a normal customer or a B2B customer.
            <br />
            To do that, you need to create a custom API Route that handles the
            checking based on the custom logic you&apos;ve chosen to indicate a
            customer is a B2B customer.
          </>
        ),
      },
      {
        title: "Customize Admin",
        path: "/admin/widgets",
        descriptionJSX: (
          <>
            As you add B2B features to your store, you may need to customize the
            admin to provide an interface to manage these features.
            <br />
            You can extend the admin plugin to add widgets,{" "}
            <Link href="/admin/routes">UI routes</Link>, or{" "}
            <Link href="/admin/setting-pages">setting pages</Link>.
          </>
        ),
      },
      {
        title: "Customize Storefront",
        path: "/starters/nextjs-medusa-starter",
        descriptionJSX: (
          <>
            You may need to customize your storefront to add different
            interfaces for B2B and regular customers, or show products
            differently.
            <br />
            You can customize the Next.js storefront, or you can{" "}
            <Link href="/storefront/roadmap">build a custom storefront</Link>.
            <br />
            In your storefront, make sure to{" "}
            <Link href="/development/publishable-api-keys/storefront/use-in-requests">
              use publishable API keys
            </Link>{" "}
            in your requests.
          </>
        ),
      },
      {
        title: "Deploy the B2B store",
        path: "/deployments/server",
        descriptionJSX: (
          <>
            Once you finish your development, you can deploy your B2B backend to
            your preferred hosting provider. You can also{" "}
            <Link href="/deployments/storefront">deploy your storefront</Link>{" "}
            to your preferred hosting provider.
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on building a B2B store!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_b2b",
      },
    },
  },
  {
    name: "integrate-ecommerce-stack",
    label: "Integrate Ecommerce Stack",
    description:
      "Use Medusa’s architecture and functionalities to integrate third-party systems and build flows around them.",
    steps: [
      {
        title: "Connect to External Systems with Services",
        path: "/development/services/create-service",
        descriptionJSX: (
          <>
            Medusa’s Services let you implement a client that connects and
            performs functionalities with your third-party system.
            <br />
            <br />
            You can then use the service to connect to your third-party system
            in other resources, such as a Workflow or an API Route.
          </>
        ),
      },
      {
        title: "Build Flows Across Systems",
        path: "/development/workflows",
        descriptionJSX: (
          <>
            With Medusa’s workflows, you can build flows with steps that may
            perform actions on different systems. Workflows can be executed from
            anywhere.
            <br />
            <br />
            For example, you can create a workflow that updates the product’s
            details in integrated systems like ERPs, WMSs, and CMSs. Then, you
            can listen to the
            <code>product.updated</code> event using a{" "}
            <Link href="/development/events/create-subscriber">Subscriber</Link>{" "}
            and execute the workflow whenever the event is triggered.
          </>
        ),
      },
      {
        title: "Create Webhook Listeners",
        path: "/development/api-routes/create",
        descriptionJSX: (
          <>
            You can provide webhook listeners that your external systems call
            when their data is updated. This lets you synchronize data between
            your systems.
            <br />
            <br />
            Webhook listeners can be created in Medusa using API Routes.
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on integrating your ecommerce stack!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_integrate-ecommerce-stack",
      },
    },
  },
]

// get a shallow copy
export const getLearningPaths = () => [...paths]

export const getLearningPath = (
  pathName: string
): LearningPathType | undefined => paths.find((path) => path.name === pathName)
