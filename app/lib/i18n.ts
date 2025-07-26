import type {I18nBase} from '@shopify/hydrogen';
import {To} from 'react-router-dom';
import {countries} from '~/data/countries';
import {useCountry} from '~/components/CountryProvider';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = url.pathname.split('/')[1]?.toUpperCase();

  type I18nFromUrl = [I18nLocale['language'], I18nLocale['country']];

  let pathPrefix = countries['default'].pathPrefix; // Default path prefix
  let [language, country]: I18nFromUrl = [
    countries['default'].language,
    countries['default'].country,
  ] as I18nFromUrl; // Default to 'default' locale

  if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {
    pathPrefix = '/' + firstPathPart.toLowerCase();
    [language, country] = firstPathPart.split('-') as I18nFromUrl;
  }

  return {language, country, pathPrefix} as I18nLocale;
}

export function usePrefixPathWithLocale(to: To): To {
  const {country} = useCountry();

  const prefix = country.pathPrefix || '';
  return `${prefix}${to.toString()}` as To;
}

export function getLocaleFromCartBuyerIdentity(
  buyerIdentity: {countryCode: string, lastName: string} | null,
): I18nLocale | undefined {
  const countryCode = buyerIdentity?.countryCode || 'FR';
  const country = countries[countryCode] || countries['FR'];

  return {
    language: country.language,
    country: country.country,
    pathPrefix: country.pathPrefix || '',
  };
}