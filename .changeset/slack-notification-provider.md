---
"@medusajs/notification-slack": patch
---

feat(notification-slack): Add Slack notification provider for Medusa

Adds a new notification provider that enables sending Medusa notifications (orders, payments, fulfillment events) to Slack channels via incoming webhooks. Includes rich message formatting using Slack's Block Kit API, support for both template-based and content-based messages, and comprehensive error handling.

Features:
- Send notifications to Slack channels via webhooks
- Rich Block Kit message formatting with order/event details
- Support for custom bot names and emoji icons
- Configurable through medusa-config.ts
- Full TypeScript support with TSDoc documentation
- Comprehensive unit test coverage (9 tests, all passing)
