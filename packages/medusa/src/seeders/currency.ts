import { CurrencyService } from '../services/currency';

export default async function seedCurrencies(currencyService: CurrencyService) {
  const currencies = [
    { code: 'AOA', name: 'Angolan Kwanza', exchange_rate: 1.0 },
    // Add other currencies here
  ];

  for (const currency of currencies) {
    const existingCurrency = await currencyService.getCurrencyByCode(currency.code);
    if (!existingCurrency) {
      await currencyService.createCurrency(currency.code, currency.name, currency.exchange_rate);
    }
  }
}