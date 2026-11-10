import { CloudAnnouncement } from "../../../types"
import { getAnnouncementForPath } from "../announcements"

const createAnnouncement = (
  data: Pick<CloudAnnouncement, "id"> & Partial<CloudAnnouncement>
): CloudAnnouncement => ({
  title: "Announcement",
  subtitle: null,
  content: null,
  image_url: null,
  type: "feature",
  link_url: null,
  admin_path: null,
  published_at: null,
  ...data,
})

const ordersTip = createAnnouncement({
  id: "anno_orders",
  type: "admin",
  admin_path: "/orders",
})
const productsTip = createAnnouncement({
  id: "anno_products",
  type: "admin",
  admin_path: "/products/",
})
const feature = createAnnouncement({ id: "anno_feature" })

const noHistory = { shownIds: [] }

describe("getAnnouncementForPath", () => {
  it("should return the announcement matching the page, ignoring trailing slashes", () => {
    const announcements = [ordersTip, productsTip]

    expect(
      getAnnouncementForPath("/orders/", announcements, noHistory)?.id
    ).toEqual("anno_orders")
    expect(
      getAnnouncementForPath("/products", announcements, noHistory)?.id
    ).toEqual("anno_products")
  })

  it("should not return an announcement for another page", () => {
    const announcements = [ordersTip, productsTip]

    expect(
      getAnnouncementForPath("/orders/order_123", announcements, noHistory)
    ).toBeUndefined()
    expect(
      getAnnouncementForPath("/settings", announcements, noHistory)
    ).toBeUndefined()
  })

  it("should return an announcement without an admin path on any page", () => {
    expect(
      getAnnouncementForPath("/settings", [ordersTip, feature], noHistory)?.id
    ).toEqual("anno_feature")
  })

  it("should prefer the announcement matching the page over one without an admin path", () => {
    const announcements = [feature, ordersTip]

    expect(
      getAnnouncementForPath("/orders", announcements, noHistory)?.id
    ).toEqual("anno_orders")
    expect(
      getAnnouncementForPath("/orders", announcements, {
        shownIds: ["anno_orders"],
      })?.id
    ).toEqual("anno_feature")
  })

  it("should not return an announcement that was already shown", () => {
    expect(
      getAnnouncementForPath("/orders", [ordersTip], {
        shownIds: ["anno_orders"],
      })
    ).toBeUndefined()
  })
})
