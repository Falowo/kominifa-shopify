import type {I18nBase} from '@shopify/hydrogen';
import {To, useMatches} from 'react-router-dom';
import {CountriesKey, countries} from '~/data/countries';
import {useCountry} from '~/components/CountryProvider';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toUpperCase();

  type I18nFromUrl = [I18nLocale['language'], I18nLocale['country']];

  let pathPrefix = ''; // Default path prefix
  let [language, country]: I18nFromUrl = ['EN', 'US'];

  if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {
    pathPrefix = '/' + firstPathPart.toLowerCase();
    [language, country] = firstPathPart.split('-') as I18nFromUrl;
  }

  return {language, country, pathPrefix} as I18nLocale;
}

export function usePrefixPathWithLocale(to: To): To {
  
  const {country} = useCountry();

  const prefix =
    country.country === 'US'
      ? ''
      : `/${country.language.toLowerCase()}-${country.country.toLowerCase()}`; // Construct the prefix based on the current country
  return `${prefix}${to.toString()}` as To;
}
