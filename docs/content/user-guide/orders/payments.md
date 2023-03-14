---
sidebar_position: 3
sidebar_label: Manage Payments
addHowToData: true
---

# Manage Order's Payments

In this document, you’ll learn how to manage an order’s payment, including capturing and refunding the payment.

## Overview

When a customer places an order, using the payment provider they choose during checkout, they authorize the payment.

The payment isn’t automatically captured. You must capture it manually from the Medusa admin.

---

## Capture Payment

:::info

Payment can only be captured once.

:::

To capture an order’s payment:

1. Open the order details page.
2. Scroll to the Payment section.
3. Click on the Capture Payment button.

---

## Refund Payment

:::caution

Refunding payments can’t be undone. Payment can only be refunded after it has been captured.

:::

To refund an order’s payment:

1. Open the order details page.
2. Scroll to the Payment section.
3. Click on the Refund button.
4. In the new window that opens:
    - Enter the Refund amount. It must be less than the Total Paid amount specified in the Payment section.
    - Choose a reason for the refund.
    - Optionally provide a note for the customer to see.
    - If you don’t want the customer to receive an email that the refund has been made, uncheck the “Send notifications” checkbox.
5. Once you’re done, click on the Complete button.

You can check refund details in the Payment, Summary, and Timeline sections.
