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
  // TODO: Eventually remove these learning paths
  {
    name: "rbac",
    label: "Role-based access control (RBAC)",
    description: "Implement roles and permissions for admin users in Medusa",
    steps: [
      {
        title: "Create Role and Permission Entities",
        path: "/development/entities/create",
        description:
          "When implementing RBAC, you typically require the availability of roles and permissions, both of which would require new entities. A role would include different permissions, such as the ability to access the products’ route, and it can be assigned to one or more users.",
      },
      {
        title: "Extend Entities",
        path: "/development/entities/extend-entity",
        descriptionJSX: (
          <>
            To associate roles with users, you need to extend the{" "}
            <code>User</code> entity to add the relation between it and the new{" "}
            <code>Role</code> entity. You can also extend other entities that
            are associated with your custom one, such as the <code>Store</code>{" "}
            entity.
          </>
        ),
      },
      {
        title: "Create Guard Middleware",
        path: "/development/api-routes/add-middleware",
        description:
          "To ensure that users who have the privilege can access an API Route, you must create a middleware that guards admin routes. This middleware will run on all authenticated admin requests to ensure that only allowed users can access an API Route.",
      },
      {
        title: "Create Services",
        path: "/development/services/create-service",
        descriptionJSX: (
          <>
            For every entity you create, such as the <code>Role</code> and{" "}
            <code>Permission</code> entities, you must create a service that
            provides create, read, update, and delete (CRUD) functionalities at
            the very least.
            <br />
            If you also extended entities, such as the <code>User</code> entity,
            you may need to{" "}
            <Link href="/development/services/extend-service">
              extend its core service
            </Link>{" "}
            <code>UserService</code> as well to perform custom functionalities
            related to your implementation.
          </>
        ),
      },
      {
        title: "Create API Routes",
        path: "/development/api-routes/create",
        descriptionJSX: (
          <>
            To manage the roles and permissions, you’ll need to create custom
            API Routes, typically for Create, Read, Update, and Delete (CRUD)
            operations.
            <br />
            After creating the API Routes, you may test adding roles and
            permissions, and how they provide different access for different
            roles and users.
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on implementing RBAC!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_rbac",
      },
    },
  },
  {
    name: "entity-and-api",
    label: "Create Entity and Expose it with API Routes",
    description:
      "Learn how to create a new table in your database, then create API Routes to expose and manipulate its data.",
    steps: [
      {
        title: "Create entity",
        path: "/development/entities/create",
        description: "Create your entity, its migration, and repository.",
      },
      {
        title: "Create service",
        path: "/development/services/create-service",
        description:
          "A service is a class that defines helper methods for your entity. The service will be used by the API Routes to access or modify the entity's data.",
      },
      {
        title: "Create API Routes",
        path: "/development/api-routes/create",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on creating your entity and API Routes!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_entity-and-api",
      },
    },
  },
  {
    name: "storefront",
    label: "Create a Custom Storefront",
    description:
      "Learn how to create a custom storefront with your preferred language or framework.",
    steps: [
      {
        title: "Choose your client",
        path: "/medusa-react/overview",
        descriptionJSX: (
          <>
            As your storefront connect to the Medusa backend, you need a way to
            interact with the backend&apos;s REST APIs. There are three ways to
            do so, based on your type of project:
            <ul>
              <li>
                <Link href="/medusa-react/overview">Medusa React</Link>: Can be
                used in any React-based project. For example, in a Next.js
                storefront.
              </li>
              <li>
                <Link href="/js-client/overview">Medusa JS Client</Link>: Can be
                used in any JavaScript and NPM based project. For example, in a
                Nuxt storefront.
              </li>
              <li>
                <Link href={`https://docs.medusajs.com/api/store`}>
                  Store REST APIs
                </Link>
                : You can send requests directly to the API Routes without using
                Medusa&apos;s clients.
              </li>
            </ul>
          </>
        ),
      },
      {
        title: "Set CORS configurations in Backend",
        path: "/development/backend/configurations#admin_cors-and-store_cors",
        description:
          "To ensure your storefront can connect to the backend, make sure to configure the backend's CORS configuration based on your storefront's local or remote URL.",
      },
      {
        title: "Create a Publishable API Key",
        path: "/user-guide/settings/publishable-api-keys",
        descriptionJSX: (
          <>
            A publishable API key allows you to associate a key with a sales
            channel. Then, you can include that key in the headers of all your
            requests.
            <br />
            You can create the publishable API key from the dashboard.
            Alternatively, you can create it using the{" "}
            <Link href="/development/publishable-api-keys/admin/manage-publishable-api-keys">
              Admin APIs
            </Link>
          </>
        ),
      },
      {
        title: "Use Publishable API Key",
        path: "/development/publishable-api-keys/storefront/use-in-requests",
        description:
          "After creating the publishable API key and associating it with sales channels, you can pass it in the header of your requests to Store API Routes.",
      },
      {
        title: "Add Region Selection",
        path: "/modules/regions-and-currencies/storefront/use-regions",
        description:
          "In your storefront, you can allow your customers to view available regions and select their current region. This can affect the prices, discounts, and shipping and payment providers available to the customer.",
      },
      {
        title: "Display Products",
        path: "/modules/products/storefront/show-products",
        description: "Display products to your customers in the storefront.",
      },
      {
        title: "Implement Cart Functionalities",
        path: "/modules/carts-and-checkout/storefront/implement-cart",
        description:
          "Allow your customers to add items to their cart, update them, and more in preparation for checkout.",
      },
      {
        title: "Implement Checkout Flow",
        path: "/modules/carts-and-checkout/storefront/implement-checkout-flow",
        description:
          "Implement the checkout flow that allows customers to handle shipping and payment, then place their orders.",
      },
      {
        title: "Implement Customer Profiles",
        path: "/modules/customers/storefront/implement-customer-profiles",
        description:
          "Allow customers to register, login, edit their profile information, and more.",
      },
      {
        title: "More Commerce Functionalities",
        path: "/modules/overview",
        descriptionJSX: (
          <>
            This recipe guided you to create a storefront with basic
            functionalities. You can add more functionalities to your storefront
            based on your use case.
            <ul>
              <li>
                The <Link href="/modules/overview">Commerce Modules</Link>{" "}
                documentation holds various storefront-related how-to guides to
                help you implement different features.
              </li>
              <li>
                You can also checkout the{" "}
                <Link href={`https://docs.medusajs.com/api/store`}>
                  Store REST APIs
                </Link>{" "}
                for a full list of available REST APIs.
              </li>
            </ul>
          </>
        ),
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on creating your storefront!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_storefront",
      },
    },
  },
  {
    name: "plugin",
    label: "Create a Plugin",
    description:
      "Learn how to create a plugin that can be re-used across Medusa backends.",
    steps: [
      {
        title: "Setup plugin project",
        path: "/development/backend/install",
        description:
          "A plugin is initially a Medusa backend with customizations. If you don't have a project ready, you can create one using Medusa's CLI tool.",
      },
      {
        title: "Implement Customizations",
        path: "/development/entities/create",
        descriptionJSX: (
          <>
            Your plugin can hold backend and admin customizations. Those
            include:
            <ul>
              <li>
                <Link href="/development/entities/create">Create Entity</Link>
              </li>
              <li>
                <Link href="/development/services/create-service">
                  Create Service
                </Link>
              </li>
              <li>
                <Link href="/development/api-routes/create">
                  Create an API Route
                </Link>
              </li>
              <li>
                <Link href="/development/events/create-subscriber">
                  Create Subscriber
                </Link>
              </li>
              <li>
                <Link href="/admin/widgets">Create Admin Widgets</Link>
              </li>
              <li>
                <Link href="/admin/routes">Create Admin Routes</Link>
              </li>
              <li>
                <Link href="/admin/setting-pages">
                  Create Admin Setting Pages
                </Link>
              </li>
              <li>
                <Link href="/development/search/create">
                  Create Search Service
                </Link>
              </li>
              <li>
                <Link href="/development/file-service/create-file-service">
                  Create File Service
                </Link>
              </li>
              <li>
                <Link href="/development/notification/create-notification-provider">
                  Create Notification Service
                </Link>
              </li>
            </ul>
            If you&apos;ve already made your custom development, you can skip to
            the next step.
          </>
        ),
      },
      {
        title: "Change your package.json",
        path: "/development/plugins/create#changes-to-packagejson",
        descriptionJSX: (
          <>
            Once you&apos;re done making your customizations and you&apos;re
            ready to publish your plugin, make changes to your{" "}
            <code>package.json</code> in preparation for publishing.
          </>
        ),
      },
      {
        title: "Optionally test locally",
        path: "/development/plugins/create#test-your-plugin",
        description:
          "If necessary, you can test your plugin in a separate local Medusa backend. It's recommended, however, to do your plugin testing within the plugin project.",
      },
      {
        title: "Publish plugin",
        path: "/development/plugins/publish",
        description: "Publish your plugin on NPM.",
      },
    ],
    finish: {
      type: "rating",
      step: {
        title: "Congratulations on creating your plugin!",
        description: "Please rate your experience using this recipe.",
        eventName: "rating_path_plugin",
      },
    },
  },
]

// get a shallow copy
export const getLearningPaths = () => [...paths]

export const getLearningPath = (
  pathName: string
): LearningPathType | undefined => paths.find((path) => path.name === pathName)
