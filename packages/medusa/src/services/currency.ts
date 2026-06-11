import { Currency } from '../models/currency';
import { CurrencyRepository } from '../repositories/currency';

class CurrencyService {
  private currencyRepository: CurrencyRepository;

  constructor(currencyRepository: CurrencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  async createCurrency(code: string, name: string, exchange_rate: number): Promise<Currency> {
    const currency = new Currency(code, name, exchange_rate);
    return this.currencyRepository.save(currency);
  }

  async getCurrencyByCode(code: string): Promise<Currency | undefined> {
    return this.currencyRepository.findOne({ where: { code } });
  }
}

export default CurrencyService;