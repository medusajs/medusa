
export const defaultPriceListData = [
  { 
    name: 'pl-1', 
    description: 'pl-1',
    prices: [ {
      id: "money-amount-USD",
      currency_code: "USD",
      amount: 500,
      min_quantity: 1,
      max_quantity: 10,
      price_list_id: 'pl-1'
    },
    {
      id: "money-amount-EUR",
      currency_code: "EUR",
      amount: 400,
      min_quantity: 1,
      max_quantity: 5,
      price_list_id: 'pl-1'
    }]
  },
  { 
    id: 'pl-2',
    name: 'pl-2', 
    description: 'pl-2',
    prices: [{
      id: "money-amount-CAD",
      currency_code: "CAD",
      amount: 600,
      min_quantity: 1,
      max_quantity: 8,
      price_list_id: 'pl-2'
    }]
  }
]