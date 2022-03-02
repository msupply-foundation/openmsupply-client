import currency from 'currency.js';
import { useCurrentLanguage } from './intlHelpers';

const trimCents = (centsString: string) => {
  const trimmed = String(Number(centsString)).slice(1);

  // If the result is an empty string, return .00
  if (!trimmed) {
    return `${centsString[0]}00`;
  }

  // Otherwise, add a single zero
  if (trimmed.length === 2) {
    return `${trimmed}0`;
  }

  // Other cases, return the full string
  return trimmed;
};

/**
 * This custom formatter is a slight modifiction to the default within
 * currency.js here: https://github.com/scurker/currency.js/blob/66b7a0c6860d5d30efe8edbf4f8ea016149eab55/src/currency.js#L96-L105
 *
 * All it does differently is add the trimming of cents with trimCents.
 *
 * Without this, using a high precision i.e. 4, will have a currency formatter to always have
 * at least 4 decimal digits.
 *
 */

export const format: currency.Format = (
  currency,
  opts
  // opts: currency.Options & { groups: RegExp } - this is the correct type.
) => {
  if (!currency) return '';
  const {
    pattern = '',
    negativePattern = '',
    symbol = '$',
    separator = ',',
    decimal = '.',
    // Groups is in the options object, but the type is not right.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    groups = /(\d)(?=(\d{3})+\b)/g,
  } = opts ?? {};

  // Split the currency string into cents and dollars.
  const [dollars = '', cents = ''] = ('' + currency)
    .replace(/^-/, '')
    .split(decimal);

  // Add the separator to the end of each dollar group.
  const dollarsString = dollars.replace(groups, `$1${separator}`);
  const centsString = trimCents(`${decimal}${cents}`);

  // Combine together..
  const moneyString = `${dollarsString}${centsString}`;

  // Use either the positive or negative pattern.
  const replacePattern = currency.value >= 0 ? pattern : negativePattern;

  // Replace the ! with symbol and # with the full money string.
  return replacePattern.replace('!', symbol).replace('#', moneyString);
};

const currencyOptions = {
  en: {
    symbol: '$',
    separator: ',',
    decimal: '.',
    precision: 10,
    pattern: '!#',
    negativePattern: '-!#',
    format,
  },
  fr: {
    symbol: 'XOF',
    separator: '.',
    decimal: ',',
    precision: 2,
    pattern: '# !',
    negativePattern: '-# !',
    format,
  },
  ar: {
    symbol: 'ر.ق.',
    separator: ',',
    decimal: '.',
    precision: 2,
    pattern: '!#',
    negativePattern: '-!#',
    format,
  },
};

export const useCurrency = () => {
  const language = useCurrentLanguage();
  const options = currencyOptions[language];
  return {
    c: (value: currency.Any) => currency(value, options),
    options,
    language,
  };
};

export const useCurrencyFormat = (value: currency.Any) => {
  const { c } = useCurrency();
  return c(value).format();
};