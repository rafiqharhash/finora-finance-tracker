import { useCallback } from 'react';
import { useUIStore } from '../store/useUIStore';
import { CURRENCIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

/**
 * Currency hook — exposes currency state and format helper
 */
export function useCurrency() {
  const { currency, setCurrency } = useUIStore();

  const currencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const formatAmount = useCallback(
    (amount) => formatCurrency(amount, currency),
    [currency]
  );

  return {
    currency,
    currencyObj,
    setCurrency,
    formatAmount,
    symbol: currencyObj.symbol,
  };
}
