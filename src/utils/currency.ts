const USD_TO_INR = 83

export const convertUsdToInr = (usd: number): number => usd * USD_TO_INR

export const formatInr = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

