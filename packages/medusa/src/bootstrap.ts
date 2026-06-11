import { seedCurrencies } from './seeders/currency';
import { CurrencyService } from './services/currency';
import { CurrencyRepository } from './repositories/currency';

export default async function bootstrap() {
  const currencyRepository = new CurrencyRepository();
  const currencyService = new CurrencyService(currencyRepository);

  await seedCurrencies(currencyService);
}