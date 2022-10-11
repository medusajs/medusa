import cors from "cors"
import { Router } from "express"
import middlewares from "../../middlewares"
import appRoutes from "./apps"
import authRoutes from "./auth"
import batchRoutes from "./batch"
import collectionRoutes from "./collections"
import currencyRoutes from "./currencies"
import customerGroupRoutes from "./customer-groups"
import customerRoutes from "./customers"
import discountRoutes from "./discounts"
import draftOrderRoutes from "./draft-orders"
import giftCardRoutes from "./gift-cards"
import inviteRoutes, { unauthenticatedInviteRoutes } from "./invites"
import noteRoutes from "./notes"
import notificationRoutes from "./notifications"
import orderRoutes from "./orders"
import orderEditRoutes from "./order-edits"
import priceListRoutes from "./price-lists"
import productTagRoutes from "./product-tags"
import productTypesRoutes from "./product-types"
import productRoutes from "./products"
import regionRoutes from "./regions"
import returnReasonRoutes from "./return-reasons"
import returnRoutes from "./returns"
import salesChannelRoutes from "./sales-channels"
import shippingOptionRoutes from "./shipping-options"
import shippingProfileRoutes from "./shipping-profiles"
import storeRoutes from "./store"
import swapRoutes from "./swaps"
import taxRateRoutes from "./tax-rates"
import uploadRoutes from "./uploads"
import userRoutes, { unauthenticatedUserRoutes } from "./users"
import variantRoutes from "./variants"

const route = Router()

export default (app, container, config) => {
  app.use("/admin", route)

  const adminCors = config.admin_cors || ""
  route.use(
    cors({
      origin: adminCors.split(","),
      credentials: true,
    })
  )

  const featureFlagRouter = container.resolve("featureFlagRouter")

  // Unauthenticated routes
  authRoutes(route)

  // reset password
  unauthenticatedUserRoutes(route)

  // accept invite
  unauthenticatedInviteRoutes(route)

  const middlewareService = container.resolve("middlewareService")
  // Calls all middleware that has been registered to run before authentication.
  middlewareService.usePreAuthentication(app)

  // Authenticated routes
  route.use(middlewares.authenticate())

  // Calls all middleware that has been registered to run after authentication.
  middlewareService.usePostAuthentication(app)

  appRoutes(route)
  batchRoutes(route)
  collectionRoutes(route)
  customerGroupRoutes(route)
  customerRoutes(route)
  currencyRoutes(route)
  discountRoutes(route)
  draftOrderRoutes(route)
  giftCardRoutes(route)
  inviteRoutes(route)
  noteRoutes(route)
  notificationRoutes(route)
  orderRoutes(route, featureFlagRouter)
  orderEditRoutes(route)
  priceListRoutes(route, featureFlagRouter)
  productRoutes(route, featureFlagRouter)
  productTagRoutes(route)
  productTypesRoutes(route)
  regionRoutes(route, featureFlagRouter)
  returnReasonRoutes(route)
  returnRoutes(route)
  salesChannelRoutes(route)
  shippingOptionRoutes(route, featureFlagRouter)
  shippingProfileRoutes(route)
  storeRoutes(route)
  swapRoutes(route)
  taxRateRoutes(route)
  uploadRoutes(route)
  userRoutes(route)
  variantRoutes(route)

  return app
}
