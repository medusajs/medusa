import { 
  MedusaContainer, 
  NotificationService,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer
): Promise<void> => {
  const notificationService = container.resolve<NotificationService>(
    "notificationService"
  )

  notificationService.subscribe("order.shipment_created", "sendgrid")
  notificationService.subscribe("order.gift_card_created", "sendgrid")
  notificationService.subscribe("gift_card.created", "sendgrid")
  notificationService.subscribe("order.placed", "sendgrid")
  notificationService.subscribe("order.canceled", "sendgrid")
  notificationService.subscribe("customer.password_reset", "sendgrid")
  notificationService.subscribe("claim.shipment_created", "sendgrid")
  notificationService.subscribe("swap.shipment_created", "sendgrid")
  notificationService.subscribe("swap.created", "sendgrid")
  notificationService.subscribe("order.items_returned", "sendgrid")
  notificationService.subscribe("order.return_requested", "sendgrid")
  notificationService.subscribe("order.refund_created", "sendgrid")
}