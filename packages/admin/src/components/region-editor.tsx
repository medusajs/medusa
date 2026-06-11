import React, { useState, useEffect } from 'react';
import { CurrencyService } from '@medusajs/medusa';

const RegionEditor = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const currencyService = new CurrencyService();
      const currencies = await currencyService.listCurrencies();
      setCurrencies(currencies);
    };
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  return (
    <div>
      <select value={selectedCurrency} onChange={handleCurrencyChange}>
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionEditor;