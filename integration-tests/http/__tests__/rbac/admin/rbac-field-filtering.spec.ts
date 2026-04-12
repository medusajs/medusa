import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(60000)

process.env.MEDUSA_FF_RBAC = "true"
process.env.MEDUSA_FF_RBAC_FILTER_FIELDS = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let container
    let baseProduct
    let testUser
    let productReadPolicy
    let productVariantReadPolicy
    let productTagReadPolicy
    let priceSetReadPolicy
    let priceReadPolicy

    beforeEach(async () => {
      container = getContainer()
      const { user } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      )
      testUser = user

      const rbacModule = container.resolve(Modules.RBAC)

      // Create RBAC policies for product operations
      productReadPolicy = await rbacModule.createRbacPolicies([
        {
          key: "read:product",
          resource: "product",
          operation: PolicyOperation.read,
          name: "Read Products",
          description: "Permission to read products",
        },
      ])

      productTagReadPolicy = await rbacModule.createRbacPolicies([
        {
          key: "read:product_tag",
          resource: "product_tag",
          operation: PolicyOperation.read,
          name: "Read Product Tags",
          description: "Permission to read product tags",
        },
      ])

      productVariantReadPolicy = await rbacModule.createRbacPolicies([
        {
          key: "read:product_variant",
          resource: "product_variant",
          operation: PolicyOperation.read,
          name: "Read Product Variants",
          description: "Permission to read product variants",
        },
      ])

      const productCreatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "create:product",
          resource: "product",
          operation: PolicyOperation.create,
          name: "Create Products",
          description: "Permission to create products",
        },
      ])

      const productVariantCreatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "create:product_variant",
          resource: "product_variant",
          operation: PolicyOperation.create,
          name: "Create Product Variants",
          description: "Permission to create product variants",
        },
      ])

      const productOptionCreatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "create:product_option",
          resource: "product_option",
          operation: PolicyOperation.create,
          name: "Create Product Options",
          description: "Permission to create product options",
        },
      ])

      const inventoryItemCreatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "create:inventory_item",
          resource: "inventory_item",
          operation: PolicyOperation.create,
          name: "Create Inventory Items",
          description: "Permission to create inventory items",
        },
      ])

      const priceSetCreatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "create:price_set",
          resource: "price_set",
          operation: PolicyOperation.create,
          name: "Create Price Sets",
          description: "Permission to create price sets",
        },
      ])

      const priceCreatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "create:price",
          resource: "price",
          operation: PolicyOperation.create,
          name: "Create Prices",
          description: "Permission to create prices",
        },
      ])

      // Add read policies for field filtering tests
      priceSetReadPolicy = await rbacModule.createRbacPolicies([
        {
          key: "read:price_set",
          resource: "price_set",
          operation: PolicyOperation.read,
          name: "Read Price Sets",
          description: "Permission to read price sets",
        },
      ])

      priceReadPolicy = await rbacModule.createRbacPolicies([
        {
          key: "read:price",
          resource: "price",
          operation: PolicyOperation.read,
          name: "Read Prices",
          description: "Permission to read prices",
        },
      ])

      const salesChannelUpdatePolicy = await rbacModule.createRbacPolicies([
        {
          key: "update:sales_channel",
          resource: "sales_channel",
          operation: PolicyOperation.update,
          name: "Update Sales Channels",
          description: "Permission to update sales channels",
        },
      ])

      const testRole = await rbacModule.createRbacRoles([
        {
          name: "Product Manager",
          description: "Can manage products and related entities",
        },
      ])

      await rbacModule.createRbacRolePolicies([
        { role_id: testRole[0].id, policy_id: productReadPolicy[0].id },
        { role_id: testRole[0].id, policy_id: productVariantReadPolicy[0].id },
        { role_id: testRole[0].id, policy_id: productCreatePolicy[0].id },
        {
          role_id: testRole[0].id,
          policy_id: productVariantCreatePolicy[0].id,
        },
        { role_id: testRole[0].id, policy_id: productOptionCreatePolicy[0].id },
        { role_id: testRole[0].id, policy_id: inventoryItemCreatePolicy[0].id },
        { role_id: testRole[0].id, policy_id: priceSetCreatePolicy[0].id },
        { role_id: testRole[0].id, policy_id: priceCreatePolicy[0].id },
        { role_id: testRole[0].id, policy_id: salesChannelUpdatePolicy[0].id },
      ])

      const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
      await remoteLink.create({
        [Modules.USER]: {
          user_id: testUser.id,
        },
        [Modules.RBAC]: {
          rbac_role_id: testRole[0].id,
        },
      })

      // Login the user to get a proper JWT token with roles
      const loginResponse = await api.post("/auth/user/emailpass", {
        email: "admin@medusa.js",
        password: "somepassword",
      })

      adminHeaders.headers[
        "authorization"
      ] = `Bearer ${loginResponse.data.token}`

      const productFixture = getProductFixture({
        title: "Test Product for RBAC Field Filtering",
      })
      const productResponse = await api.post(
        "/admin/products",
        productFixture,
        adminHeaders
      )
      baseProduct = productResponse.data.product
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("RBAC Middleware Integration", () => {
      it("should process requests through RBAC middleware", async () => {
        // This test validates that requests are processed through the RBAC middleware
        // and the prepareListQuery function with field filtering works
        const response = await api.get(
          `/admin/products/${baseProduct.id}?fields=id,title`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product).toBeDefined()

        // The fact that we get a successful response means the middleware
        // chain including RBAC validation is working
        expect(response.data.product).toHaveProperty("id")
        expect(response.data.product).toHaveProperty("title")
      })

      it("should handle prepareRetrieveQuery integration", async () => {
        // Test that prepareRetrieveQuery also works with async RBAC
        const response = await api.get(
          `/admin/products/${baseProduct.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product).toBeDefined()
        expect(response.data.product).toHaveProperty("id")
      })

      it("should verify RBAC is properly enforced", async () => {
        const unauthorizedHeaders = {
          headers: { "x-medusa-access-token": "test_token" },
        }

        // Create user with empty roles array to prevent super admin assignment
        await createAdminUser(dbConnection, unauthorizedHeaders, container, {
          email: "unauthorized@medusa.js",
          roles: [],
        })

        // Login the user to get a JWT token (but without roles since none were assigned)
        const loginResponse = await api.post("/auth/user/emailpass", {
          email: "unauthorized@medusa.js",
          password: "somepassword",
        })

        const copyAdminHeaders = { ...adminHeaders }
        copyAdminHeaders.headers[
          "authorization"
        ] = `Bearer ${loginResponse.data.token}`

        // This should fail due to lack of permissions
        const response = await api
          .get(`/admin/products/${baseProduct.id}`, copyAdminHeaders)
          .catch((error) => error.response)

        expect(response.status).toEqual(403)
        expect(response.data.message).toContain("Forbidden")
      })

      it("should filter out fields not allowed - product with no tags and no prices", async () => {
        const unauthorizedHeaders = {
          headers: { "x-medusa-access-token": "test_token" },
        }

        const rbacModule = container.resolve(Modules.RBAC)

        // Create a limited role with only read permissions
        const limitedRole = await rbacModule.createRbacRoles([
          {
            name: "Product Reader",
            description: "Can only read products and prices",
          },
        ])

        await rbacModule.createRbacRolePolicies([
          { role_id: limitedRole[0].id, policy_id: productReadPolicy[0].id },
          {
            role_id: limitedRole[0].id,
            policy_id: productVariantReadPolicy[0].id,
          },
        ])

        // Create user with the limited role (not super admin)
        await createAdminUser(dbConnection, unauthorizedHeaders, container, {
          email: "unauthorized@medusa.js",
          roles: [limitedRole[0].id],
        })

        const loginResponse = await api.post("/auth/user/emailpass", {
          email: "unauthorized@medusa.js",
          password: "somepassword",
        })

        const copyAdminHeaders = { ...adminHeaders }
        copyAdminHeaders.headers[
          "authorization"
        ] = `Bearer ${loginResponse.data.token}`

        const response = await api.get(
          `/admin/products/${baseProduct.id}`,
          copyAdminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product).toBeDefined()

        // Verify that restricted fields are properly filtered out
        expect(response.data.product.tags).not.toBeDefined()
        expect(response.data.product.variants).toBeDefined()
        expect(response.data.product.variants[0].prices).not.toBeDefined()

        expect(response.data.product.id).toBeDefined()
        expect(response.data.product.title).toBeDefined()
        expect(response.data.product.status).toBeDefined()
        expect(response.data.product.variants).toEqual(expect.any(Array))
        expect(response.data.product.variants[0].id).toBeDefined()
        expect(response.data.product.variants[0].title).toBeDefined()

        expect(response.data.product.variants[0].prices).toBeUndefined()
        expect(response.data.product.variants[0]).not.toHaveProperty("prices")
        expect(response.data.product).not.toHaveProperty("tags")
      })

      it("should filter out fields not allowed - product with prices and product tags", async () => {
        const unauthorizedHeaders = {
          headers: { "x-medusa-access-token": "test_token" },
        }

        const rbacModule = container.resolve(Modules.RBAC)

        // Create a limited role with only read permissions
        const limitedRole = await rbacModule.createRbacRoles([
          {
            name: "Product Reader With Tags",
            description: "Can only read products and prices",
          },
        ])

        await rbacModule.createRbacRolePolicies([
          { role_id: limitedRole[0].id, policy_id: productReadPolicy[0].id },
          {
            role_id: limitedRole[0].id,
            policy_id: productVariantReadPolicy[0].id,
          },
          {
            role_id: limitedRole[0].id,
            policy_id: productTagReadPolicy[0].id,
          },
          {
            role_id: limitedRole[0].id,
            policy_id: priceReadPolicy[0].id,
          },
          {
            role_id: limitedRole[0].id,
            policy_id: priceSetReadPolicy[0].id,
          },
        ])

        // Create user with the limited role (not super admin)
        await createAdminUser(dbConnection, unauthorizedHeaders, container, {
          email: "unauthorized@medusa.js",
          roles: [limitedRole[0].id],
        })

        const loginResponse = await api.post("/auth/user/emailpass", {
          email: "unauthorized@medusa.js",
          password: "somepassword",
        })

        const copyAdminHeaders = { ...adminHeaders }
        copyAdminHeaders.headers[
          "authorization"
        ] = `Bearer ${loginResponse.data.token}`

        const response = await api.get(
          `/admin/products/${baseProduct.id}`,
          copyAdminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.product).toBeDefined()

        // With full permissions, all fields should be present
        expect(response.data.product.tags).toBeDefined()
        expect(response.data.product.variants).toBeDefined()
        expect(response.data.product.variants[0].prices).toBeDefined()

        expect(response.data.product.tags).toEqual(expect.any(Array))
        expect(response.data.product.variants[0].prices).toEqual(
          expect.any(Array)
        )
        expect(response.data.product.variants[0].prices.length).toBeGreaterThan(
          0
        )
        expect(response.data.product.variants[0].prices[0].amount).toBeDefined()
        expect(
          response.data.product.variants[0].prices[0].currency_code
        ).toBeDefined()
      })

      it("should allow super admin with wildcard permissions to perform all product operations", async () => {
        const superAdminHeaders = {
          headers: { "x-medusa-access-token": "test_token" },
        }

        // Use the super admin role created by the module loader
        // createAdminUser will automatically assign the super admin role
        await createAdminUser(dbConnection, superAdminHeaders, container, {
          email: "superadmin@medusa.js",
        })

        // Login the super admin user
        const loginResponse = await api.post("/auth/user/emailpass", {
          email: "superadmin@medusa.js",
          password: "somepassword",
        })

        superAdminHeaders.headers[
          "authorization"
        ] = `Bearer ${loginResponse.data.token}`

        // Test READ operation - should succeed
        const readResponse = await api.get(
          `/admin/products/${baseProduct.id}`,
          superAdminHeaders
        )
        expect(readResponse.status).toEqual(200)
        expect(readResponse.data.product).toBeDefined()
        expect(readResponse.data.product.tags).toBeDefined()
        expect(readResponse.data.product.variants).toBeDefined()
        expect(readResponse.data.product.variants[0].prices).toBeDefined()

        // Test CREATE operation - should succeed
        const createProductData = getProductFixture({
          title: "Super Admin Test Product",
        })
        const createResponse = await api.post(
          "/admin/products",
          createProductData,
          superAdminHeaders
        )
        expect(createResponse.status).toEqual(200)
        expect(createResponse.data.product).toBeDefined()
        expect(createResponse.data.product.title).toEqual(
          "Super Admin Test Product"
        )

        const createdProductId = createResponse.data.product.id

        // Test UPDATE operation - should succeed
        const updateResponse = await api.post(
          `/admin/products/${createdProductId}`,
          { title: "Updated Super Admin Test Product" },
          superAdminHeaders
        )
        expect(updateResponse.status).toEqual(200)
        expect(updateResponse.data.product.title).toEqual(
          "Updated Super Admin Test Product"
        )

        // Test DELETE operation - should succeed
        const deleteResponse = await api.delete(
          `/admin/products/${createdProductId}`,
          superAdminHeaders
        )
        expect(deleteResponse.status).toEqual(200)
        expect(deleteResponse.data.id).toEqual(createdProductId)
        expect(deleteResponse.data.deleted).toEqual(true)

        // Verify the product is actually deleted
        const verifyDeleteResponse = await api
          .get(`/admin/products/${createdProductId}`, superAdminHeaders)
          .catch((error) => error.response)
        expect(verifyDeleteResponse.status).toEqual(404)
      })
    })
  },
})
