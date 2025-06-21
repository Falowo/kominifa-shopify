import { useMatches } from 'react-router-dom';
import {type Locale, countries} from '~/data/countries';
import {isValidCountryKey} from '~/data/countries';

export function getLocaleFromRequest(request: Request): Locale | undefined {
  const url = new URL(request.url);
  console.log('url.href in getLocaleFromRequest:', url.href);
  console.log('url.pathname:', url.pathname);
  console.log(`url.pathname.split('/')[1]: ${url.pathname.split('/')[1]}`);
  //  Check if the pathname starts with a country code
  if (!url.pathname.startsWith('/')) {
    console.log('URL pathname does not start with a slash');
    return undefined;
  }
  if (url.pathname.split('/').length < 2) {
    console.log('URL pathname does not contain enough segments');
    return undefined;
  }
  if (url.pathname.split('/')[1] === '') {
    console.log('URL pathname has an empty segment after the first slash');
    return undefined;
  }
  if (!isValidCountryKey(url.pathname.split('/')[1].toLowerCase())) {
    console.log(
      `Invalid country code in URL pathname: ${url.pathname.split('/')[1]}`,
    );
    console.log('URL pathname does not start with a slash');
    return undefined;
  }
  console.log('Valid country code found in URL pathname');
  console.log('Country Code:', url.pathname.split('/')[1].toLowerCase());
  console.log('Countries Object:', countries);

  const locale =
    countries[url.pathname.split('/')[1].toLowerCase()] || undefined;
  console.log('Locale:', locale);
  if (!locale) {
    console.warn(
      `Locale not found for country code: ${url.pathname.split('/')[1].toLowerCase()}`,
    );
    return undefined;
  }
  return locale;
}

