// Comprehensive ISO currency definitions with flags, symbols, names, and regions
export const CURRENCY_METADATA = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', region: 'Americas' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', region: 'Europe' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', region: 'Europe' },
  ETB: { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', region: 'Africa' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', region: 'Asia' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', region: 'Americas' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', flag: '🇦🇺', region: 'Oceania' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', region: 'Europe' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', region: 'Asia' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', region: 'Asia' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', region: 'Middle East' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', region: 'Middle East' },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', flag: '🇶🇦', region: 'Middle East' },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', region: 'Africa' },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', region: 'Africa' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', region: 'Africa' },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', region: 'Africa' },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', region: 'Africa' },
  RWF: { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼', region: 'Africa' },
  UGX: { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', region: 'Africa' },
  TZS: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', region: 'Africa' },
  DJF: { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', flag: '🇩🇯', region: 'Africa' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', region: 'Americas' },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽', region: 'Americas' },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷', region: 'Americas' },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', region: 'Americas' },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', region: 'Americas' },
  PEN: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.', flag: '🇵🇪', region: 'Americas' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', region: 'Asia' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', region: 'Asia' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', region: 'Oceania' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', region: 'Europe' },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', region: 'Europe' },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', region: 'Europe' },
  PLN: { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', region: 'Europe' },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', region: 'Middle East' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', region: 'Asia' },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', region: 'Asia' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', region: 'Asia' },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', region: 'Asia' },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', region: 'Asia' },
  VND: { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', region: 'Asia' },
  PKR: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰', region: 'Asia' },
  BDT: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', region: 'Asia' },
  ILS: { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', region: 'Middle East' },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼', region: 'Middle East' },
  BHD: { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭', region: 'Middle East' },
  OMR: { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', flag: '🇴🇲', region: 'Middle East' },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', region: 'Europe' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', region: 'Europe' },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', region: 'Europe' },
  RON: { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', region: 'Europe' },
  BGN: { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬', region: 'Europe' },
  ISK: { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', flag: '🇮🇸', region: 'Europe' },
  HRK: { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', flag: '🇭🇷', region: 'Europe' },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', region: 'Africa' },
  TND: { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', flag: '🇹🇳', region: 'Africa' },
  DZD: { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA', flag: '🇩🇿', region: 'Africa' }
};

export const getCurrencyInfo = (code) => {
  if (!code) return { code: '???', name: 'Unknown Currency', symbol: '', flag: '🌐', region: 'Global' };
  const upper = code.toUpperCase();
  if (CURRENCY_METADATA[upper]) {
    return CURRENCY_METADATA[upper];
  }
  return {
    code: upper,
    name: `${upper} Currency`,
    symbol: upper,
    flag: '🌐',
    region: 'Global'
  };
};

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'ETB', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'AED'];
