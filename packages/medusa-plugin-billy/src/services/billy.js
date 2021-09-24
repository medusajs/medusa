import axios from "axios"
import { BaseService } from "medusa-interfaces"
import { humanizeAmount } from "medusa-core-utils"

const BILLY_ROOT_API = "https://api.billysbilling.com/v2"

const BillyDaybookTransactionStatus = {
  DRAFT: "draft",
  APPROVED: "approved",
}

// TODO
// - Add support for returns
// - Add support for exchanges
// - Add support for claims
//   - Refunded claims
//   - Replaced claims at cost price

class BillyService extends BaseService {
  constructor({}, options) {
    super()

    this.options_ = {
      sales_account: `1110`,
      shipping_account: `1115`,
      gift_card_account: `7395`,
      customer_accounts_receivable: `5810`,
      payments_account: `5710`,
      cogs_account: `1210`,
      stock_account: `5830`,
      register_payments: true,
      register_orders: true,
      register_shipments: true,
      ...options,
    }

    this.client_ = axios.create({
      baseURL: BILLY_ROOT_API,
      headers: {
        "X-Access-Token": options.api_key,
      },
    })

    this.taxRates_ = {}
    this.accounts_ = {}

    this.accountCache_ = null
  }

  /**
   * Creates a customer payment in Billy. Customer payments indicate that money
   * has been received in a "bank account" and that the accounts receivable can
   * be credited.
   * @param {Order} fromOrder - the order to base the payment on
   * @return {Promise} result from posting transaction
   */
  async createCustomerPayment(fromOrder) {
    if (!this.options_.register_payments) {
      return
    }

    const payment = fromOrder.payments[0]
    const [entryDate] = payment.captured_at.toISOString().split("T")

    const daybookTransaction = {
      description: `Order ${fromOrder.display_id} payment`,
      daybookId: await this.getMedusaDaybookId(),
      state: BillyDaybookTransactionStatus.DRAFT,
      entryDate,
    }

    daybookTransaction.lines = [
      {
        text: `Payment ${payment.provider_id}`,
        accountId: await this.getCustomerAccountsReceivableId(fromOrder.region),
        contraAccountId: await this.getPaymentsAccount(payment),
        amount: humanizeAmount(payment.amount, payment.currency_code),
        currencyId: payment.currency_code,
        side: "credit",
      },
    ]

    return await this.client_.post("/daybookTransactions", {
      daybookTransaction,
    })
  }

  /**
   * Regulates stock and COGS account, as a result of goods having left the
   * warehouse. Will calculate the cost of the order and regulate based on that.
   * @param {Order} fromOrder - the order that the shipment came from
   * @param {Fulfillment} fromFulfillment - the fulfillment that has been shipped
   * @param {ProductVariant[]} variants - the variants in the fulfillment
   * @return {Promise} result from posting transaction
   */
  async createGoodsOut(fromOrder, fromFulfillment, variants) {
    if (!this.options_.register_shipments) {
      return
    }

    const [entryDate] = fromFulfillment.shipped_at.toISOString().split("T")
    const daybookTransaction = {
      description: `Order ${fromOrder.display_id} shipment`,
      daybookId: await this.getMedusaDaybookId(),
      state: BillyDaybookTransactionStatus.DRAFT,
      entryDate,
      lines: [],
    }

    /*
     * Cost prices may differ in currencies. In Billy we sum the cost in each
     * currency and add the totals on separate lines.
     */
    const currencyDistributions = fromFulfillment.items.reduce((acc, next) => {
      const variant = variants.find((v) => v.id === next.item.variant_id)
      const costPrice = variant.cost_price
      if (costPrice) {
        if (acc[costPrice.currency_code]) {
          acc[costPrice.currency_code] += next.quantity * costPrice.amount
        } else {
          acc[costPrice.currency_code] = next.quantity * costPrice.amount
        }
      }

      return acc
    }, {})

    for (const [currency, amount] of Object.entries(currencyDistributions)) {
      daybookTransaction.lines.push({
        text: "Products shipped",
        accountId: await this.getStockAccountId(),
        contraAccountId: await this.getCostOfGoodsSoldId(),
        amount: humanizeAmount(amount, currency),
        currencyId: currency,
        side: "credit",
      })
    }

    if (daybookTransaction.lines.length > 0) {
      return await this.client_.post("/daybookTransactions", {
        daybookTransaction,
      })
    }
  }

  /**
   * Creates an Order in Billy. The Order credits the sales account and debits
   * accounts receivable. When the payment is processed the bank account is
   * debited and accounts receivable is credited.
   * @param {Order} fromOrder - the order to create
   * @return {Promise} result from posting transaction
   */
  async createCustomerInvoice(fromOrder) {
    if (!this.options_.register_orders) {
      return
    }

    const [entryDate] = fromOrder.created_at.toISOString().split("T")
    const daybookTransaction = {
      description: `Order ${fromOrder.display_id}`,
      daybookId: await this.getMedusaDaybookId(),
      state: BillyDaybookTransactionStatus.DRAFT,
      entryDate,
    }

    const giftCardPurchase = fromOrder.items.reduce((acc, next) => {
      if (next.is_giftcard) {
        return acc + next.unit_price * next.quantity
      }
      return acc
    }, 0)

    let lines = [
      {
        text: "Products",
        accountId: await this.getSalesAccountId(fromOrder.region),
        contraAccountId: await this.getCustomerAccountsReceivableId(
          fromOrder.region
        ),
        taxRateId: await this.getTaxRateId(fromOrder.region),
        amount: humanizeAmount(
          fromOrder.subtotal - giftCardPurchase - fromOrder.discount_total,
          fromOrder.currency_code
        ),
        currencyId: fromOrder.currency_code,
        side: "credit",
      },
    ]

    /*
     * Purchasing a gift card essentially means that some money is being held in
     * a temporary account. We therefore credit a gift card account. The
     * customer owes the payment is processed - hence we debit accounts
     * receivable. Once the payment is processed accounts receivable will be
     * credited and the "bank account" will be debited. See below for usage of
     * a gift card.
     */
    if (giftCardPurchase) {
      lines.push({
        text: "Gift Card Purchase",
        accountId: await this.getGiftCardAccountId(fromOrder.region),
        contraAccountId: await this.getCustomerAccountsReceivableId(
          fromOrder.region
        ),
        amount: humanizeAmount(giftCardPurchase, fromOrder.currency_code),
        currencyId: fromOrder.currency_code,
        side: "credit",
      })
    }

    if (fromOrder.shipping_total) {
      lines.push({
        text: "Shipping",
        accountId: await this.getShippingAccountId(fromOrder.region),
        contraAccountId: await this.getCustomerAccountsReceivableId(
          fromOrder.region
        ),
        taxRateId: await this.getTaxRateId(fromOrder.region),
        amount: humanizeAmount(
          fromOrder.shipping_total,
          fromOrder.currency_code
        ),
        currencyId: fromOrder.currency_code,
        side: "credit",
      })
    }

    /*
     * When a gift card we are taking some money that was previously put in the
     * temporary account and using it towards a payment of an order. This means
     * that the payment is immediately completed - accounts receivable is
     * credited and the gift card account debited.
     */
    if (fromOrder.gift_card_total) {
      lines.push({
        text: "Gift Card Payment",
        accountId: await this.getCustomerAccountsReceivableId(fromOrder.region),
        contraAccountId: await this.getGiftCardAccountId(fromOrder.region),
        amount: humanizeAmount(
          fromOrder.gift_card_total,
          fromOrder.currency_code
        ),
        currencyId: fromOrder.currency_code,
        side: "credit",
      })
    }

    daybookTransaction.lines = lines

    const result = await this.client_.post("/daybookTransactions", {
      daybookTransaction,
    })
  }

  /**
   * Gets the configured gift card account - if none is configured for the region
   * the default account from options will be used.
   * @param {Region} fromRegion - the region to fetch the gift card account from.
   * @return {Promise<string>} the id of the Billy account for gift cards
   */
  async getGiftCardAccountId(fromRegion) {
    return await this.coalesceAccount(
      fromRegion,
      "gift_card_nominal_code",
      "gift_card_account"
    )
  }

  /**
   * Gets the configured shipping account - if none is configured for the region
   * the default account from options will be used.
   * @param {Region} fromRegion - the region to fetch the account from.
   * @return {Promise<string>} the id of the Billy account
   */
  async getShippingAccountId(fromRegion) {
    return await this.coalesceAccount(
      fromRegion,
      "shipping_nominal_code",
      "shipping_account"
    )
  }

  /**
   * Gets the configured tax rate for the region - if none is used the plugin
   * defaults to using no tax.
   * @param {Region} fromRegion - the region to fetch the tax rate from.
   * @return {Promise<string>} the id of the Billy tax rate
   */
  async getTaxRateId(fromRegion) {
    if (!fromRegion.tax_code) {
      return null
    }

    if (fromRegion.tax_code in this.taxRates_) {
      return this.taxRates_[fromRegion.tax_code]
    }

    const { taxRates } = await this.client_
      .get("/taxRates")
      .then(({ data }) => data)
    const regionRate = taxRates.find(
      (tr) => tr.abbreviation === fromRegion.tax_code
    )

    // It may be the case that no tax rate is configured.
    this.taxRates_[fromRegion.tax_code] = regionRate?.id

    return regionRate?.id
  }

  /**
   * Gets the Id of the Medusa daybook. Will first look for any daybook named
   * "Medusa" if no daybook with that name exists a daybook will be created with
   * the name.
   * @return {Promise<string>} the id of the Medusa daybook in Billy
   */
  async getMedusaDaybookId() {
    if (this.medusaDaybookId_) {
      return this.medusaDaybookId_
    }

    const { daybooks } = await this.client_
      .get("/daybooks")
      .then(({ data }) => data)

    const medusaDaybook = daybooks.find((db) => db.name === "Medusa")
    if (medusaDaybook) {
      this.medusaDaybookId_ = medusaDaybook.id
      return medusaDaybook.id
    }

    const { daybooks: newDbs } = await this.client_
      .post("/daybooks", { daybook: { name: "Medusa" } })
      .then(({ data }) => data)

    this.medusaDaybookId_ = newDbs[0].id
    return newDbs[0].id
  }

  /**
   * Gets the configured sales account - if none is configured for the region
   * the default account from options will be used.
   * @param {Region} fromRegion - the region to fetch the account from.
   * @return {Promise<string>} the id of the Billy account
   */
  async getSalesAccountId(fromRegion) {
    return await this.coalesceAccount(
      fromRegion,
      "sales_nominal_code",
      "sales_account"
    )
  }

  /**
   * Gets the configured accounts receiveabl - if none is configured for the
   * region the default account from options will be used.
   * @param {Region} fromRegion - the region to fetch the account from.
   * @return {Promise<string>} the id of the Billy account
   */
  async getCustomerAccountsReceivableId(fromRegion) {
    return await this.coalesceAccount(
      fromRegion,
      "accounts_receivable_nominal_code",
      "customer_accounts_receivable"
    )
  }

  /**
   * Gets the configured payments account - the payments account may be
   * conditionally retrieved based on the provider id.
   * @param {Payment} fromPayment - the payment to get account for.
   * @return {Promise<string>} the id of the Billy account
   */
  async getPaymentsAccount(fromPayment) {
    return await this.getAccountByOptionKey("payments_account")
  }

  /**
   * Gets the configured COGS account.
   * @return {Promise<string>} the id of the Billy account
   */
  async getCostOfGoodsSoldId() {
    return await this.getAccountByOptionKey("cogs_account")
  }

  /**
   * Gets the configured stock account.
   * @return {Promise<string>} the id of the Billy account
   */
  async getStockAccountId() {
    return await this.getAccountByOptionKey("stock_account")
  }

  /**
   * Checks if the region has an account number configured for the field
   * `regionKey` and returns the account id based on that. If no account number
   * is configured, the function moves on to get the account id based on the
   * `optionKey`.
   * @param {Region} fromRegion - the region to check for account configuration.
   * @param {string} regionKey - the key to check in the region.
   * @param {string} key - the key to check in the plugin options.
   * @return {Promise<string>} the id of the Billy account
   */
  async coalesceAccount(fromRegion, regionKey, optionKey) {
    if (fromRegion && fromRegion[regionKey]) {
      try {
        return await this.getAccountByNumber(fromRegion[regionKey])
      } catch (err) {
        // fallback to default
      }
    }

    return await this.getAccountByOptionKey(optionKey)
  }

  /**
   * Gets the Billy account id representing an account number. The account
   * number to find the id for is mapped to the `key` in the plugin options.
   * @param {string} key - the key to check in the plugin options.
   * @return {Promise<string>} the id of the Billy account
   */
  async getAccountByOptionKey(key) {
    const accountNumber = this.options_[key]
    return await this.getAccountByNumber(accountNumber)
  }

  /**
   * Gets a Billy account id from an account number, by looking up the account
   * number via Billy's API.
   * @param {string} accountNumber - the account number to get the id for.
   * @return {Promise<string>} the id of the Billy account
   */
  async getAccountByNumber(accountNumber) {
    if (accountNumber in this.accounts_) {
      return this.accounts_[accountNumber]
    }

    const { accounts } = await this.client_
      .get(`/accounts?accountNo=${accountNumber}`)
      .then(({ data }) => data)

    const keyAccount = accounts[0]

    this.accounts_[accountNumber] = keyAccount.id

    return keyAccount.id
  }
}

export default BillyService
