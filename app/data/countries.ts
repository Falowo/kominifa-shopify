import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
import type {ICountryData, TCountryCode} from 'countries-list';

// Main data and utils
import {countries as countriesList} from 'countries-list';
// Utils
import {getCountryData, getEmojiFlag} from 'countries-list';
export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  host: string;
  pathPrefix?: string;
};

const countryCodeList: TCountryCode[] = Object.keys(
  countriesList,
) as TCountryCode[];
// const shopifyCountryCodeList: CountryCode[] = countryCodeList as CountryCode[];
// const shopifyLanguageCodeList: LanguageCode[] = Object.keys(
//   languages,
// ) as LanguageCode[];

const countriesListData: ICountryData[] = countryCodeList
  .filter((countryCode) => countryCode !== 'AQ')
  .map((code) => {
    const countryData: ICountryData = getCountryData(code);
    return {
      name: countryData.name,
      native: countryData.native,
      phone: countryData.phone,
      continent: countryData.continent,
      capital: countryData.capital,
      currency: countryData.currency,
      languages: countryData.languages,
      emoji: getEmojiFlag(code),
      iso2: countryData.iso2,
      iso3: countryData.iso3,
      partOf: countryData.partOf,
      userAssigned: countryData.userAssigned,
    };
  });

export const countries: Record<string, Locale> = {
  default: {
    language: 'FR' as LanguageCode,
    country: 'FR' as CountryCode,
    label: 'France',
    // I want to use the myHost variable from the loader function
    // to set the host dynamically
    host: '',
    pathPrefix: '/fr-fr',
  },

  ...countriesListData.reduce(
    (acc, country) => {
      const language =
        (country.languages?.[0]?.toUpperCase() as LanguageCode) || 'EN';
      const countryCode = country.iso2 as TCountryCode;
      acc[`${countryCode.toLowerCase()}`] = {
        language: language as LanguageCode,
        country: countryCode as CountryCode,
        label: `${country.name}`,
        host: '',
        pathPrefix: `/${language.toLocaleLowerCase()}-${countryCode.toLowerCase()}`,
      };
      return acc;
    },
    {} as Record<string, Locale>,
  ),
  // Add more as needed
};

export type CountriesKey = keyof typeof countries;
export function isValidCountryKey(key: string): key is CountriesKey {
  return key in countries;
}
