import {CountryCode} from '@shopify/hydrogen/customer-account-api-types';
import {type Locale, countries} from '~/data/countries';

export function getLocaleFromRequest(request: Request): Locale | undefined {
  const url = new URL(request.url);
  console.log('Request URL:', url.href);
  console.log('Request Pathname:', url.pathname);
  console.log('Request Country Code:', url.pathname.split('/')[1]);
  console.log('Available Countries:', countries);
  // Extract the country code from the URL path
  const countryCode =
    (url.pathname.split('/')[1].toUpperCase().split('.')[0] as CountryCode) || undefined;
  console.log('Extracted Country Code:', countryCode);
  console.log('Country Code from Pathname:', url.pathname.split('/')[1]);
  // Convert to uppercase to match the keys in the countries object
  if (!countryCode) {
    console.warn('No country code found in the URL path');
    return undefined;
  }
  if (countryCode.length !== 2) {
    console.warn(`Invalid country code length: ${countryCode}`);
    return undefined;
  }
  if (!/^[a-zA-Z]{2}$/.test(countryCode)) {
    console.warn(`Invalid country code format: ${countryCode}`);
    return undefined;
  }
  const locale = countries[countryCode.toLowerCase()] || undefined;
  console.log('Locale:', locale);
  if (!locale) {
    console.warn(`Locale not found for country code: ${countryCode}`);
    return undefined;
  }
  return locale;
}
