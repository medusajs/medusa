import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let orderModule: IOrderModuleService

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      orderModule = container.resolve(Modules.ORDER)
    })

    const createOrder = async () => {
      return await orderModule.createOrders({
        currency_code: "usd",
        email: "test@medusajs.com",
        items: [
          {
            title: "Test item",
            product_title: "Cool Product",
            quantity: 1,
            unit_price: 10,
          },
        ],
        shipping_methods: [{ name: "Standard", amount: 10 }],
      })
    }

    const createTag = async (value: string) => {
      const response = await api.post(
        "/admin/order-tags",
        { value },
        adminHeaders
      )
      return response.data.order_tag
    }

    describe("POST /admin/orders/tags/batch", () => {
      let orderA
      let orderB
      let tagPriority

      beforeEach(async () => {
        orderA = await createOrder()
        orderB = await createOrder()
        tagPriority = await createTag(`priority-${Math.random()}`)
      })

      it("adds and removes tags across multiple orders in one call", async () => {
        await api.post(
          "/admin/orders/tags/batch",
          { order_ids: [orderA.id, orderB.id], add: [tagPriority.id] },
          adminHeaders
        )

        const a = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        const b = await api.get(
          `/admin/orders/${orderB.id}?fields=*tags`,
          adminHeaders
        )

        expect(a.data.order.tags.map((t) => t.id)).toContain(tagPriority.id)
        expect(b.data.order.tags.map((t) => t.id)).toContain(tagPriority.id)

        // Removing an already-persisted tag association also works, not
        // just adding one.
        await api.post(
          "/admin/orders/tags/batch",
          { order_ids: [orderA.id, orderB.id], remove: [tagPriority.id] },
          adminHeaders
        )

        const aAfterRemove = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        const bAfterRemove = await api.get(
          `/admin/orders/${orderB.id}?fields=*tags`,
          adminHeaders
        )

        expect(aAfterRemove.data.order.tags.map((t) => t.id)).not.toContain(
          tagPriority.id
        )
        expect(bAfterRemove.data.order.tags.map((t) => t.id)).not.toContain(
          tagPriority.id
        )
      })

      it("treats remove as winning when the same tag id appears in both add and remove", async () => {
        await api.post(
          "/admin/orders/tags/batch",
          {
            order_ids: [orderA.id],
            add: [tagPriority.id],
            remove: [tagPriority.id],
          },
          adminHeaders
        )

        const a = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        expect(a.data.order.tags.map((t) => t.id)).not.toContain(tagPriority.id)
      })

      it("fails the whole batch without mutating any order when one tag id doesn't exist", async () => {
        // Give orderB an existing, valid tag via a separate successful call
        // first, so there's something for a partial-application bug to
        // leak through - a batch that adds nothing to either order can't
        // actually prove the whole batch didn't partially apply.
        await api.post(
          "/admin/orders/tags/batch",
          { order_ids: [orderB.id], add: [tagPriority.id] },
          adminHeaders
        )

        const tagSecondary = await createTag(`secondary-${Math.random()}`)

        const beforeA = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        const beforeB = await api.get(
          `/admin/orders/${orderB.id}?fields=*tags`,
          adminHeaders
        )

        const response = await api
          .post(
            "/admin/orders/tags/batch",
            {
              order_ids: [orderB.id, orderA.id],
              add: [tagSecondary.id, "otag_does_not_exist"],
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(404)

        const afterA = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        const afterB = await api.get(
          `/admin/orders/${orderB.id}?fields=*tags`,
          adminHeaders
        )

        expect(afterA.data.order.tags).toEqual(beforeA.data.order.tags)
        expect(afterB.data.order.tags).toEqual(beforeB.data.order.tags)

        // Specifically prove the order that WOULD have received the valid
        // tag (orderB, listed first in order_ids) did not get it applied
        // before the batch hit the missing tag id.
        expect(afterB.data.order.tags.map((t) => t.id)).not.toContain(
          tagSecondary.id
        )
      })

      it("preserves an order's existing tags when adding another tag", async () => {
        const tagSecondary = await createTag(`secondary-${Math.random()}`)

        await api.post(
          "/admin/orders/tags/batch",
          { order_ids: [orderA.id], add: [tagPriority.id] },
          adminHeaders
        )

        await api.post(
          "/admin/orders/tags/batch",
          { order_ids: [orderA.id], add: [tagSecondary.id] },
          adminHeaders
        )

        const after = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        const tagIds = after.data.order.tags.map((t) => t.id)

        expect(tagIds).toContain(tagPriority.id)
        expect(tagIds).toContain(tagSecondary.id)
      })

      it("fails the whole batch without mutating any order when one order id doesn't exist", async () => {
        const before = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )

        const response = await api
          .post(
            "/admin/orders/tags/batch",
            {
              order_ids: [orderA.id, "order_does_not_exist"],
              add: [tagPriority.id],
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(404)

        const after = await api.get(
          `/admin/orders/${orderA.id}?fields=*tags`,
          adminHeaders
        )
        expect(after.data.order.tags).toEqual(before.data.order.tags)
      })

      it("rejects a request with neither add nor remove", async () => {
        const response = await api
          .post(
            "/admin/orders/tags/batch",
            { order_ids: [orderA.id] },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(400)
      })
    })
  },
})
