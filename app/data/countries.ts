  import type {
  CountryCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
import type {ICountryData, TCountryCode, TLanguageCode} from 'countries-list';

// Main data and utils
import {countries as countriesList, languages} from 'countries-list';
// Utils
import {getCountryData, getEmojiFlag} from 'countries-list';
import {LoaderFunctionArgs} from 'react-router';
export type Locale = {
  language: LanguageCode;
  country: CountryCode;
  label: string;
  host: string;
  pathPrefix?: string;
};

// I need a loader function to load the .env variables

export async function loader({context}: LoaderFunctionArgs) {
  const myHost = context.env.HOST;
  // Pass myHost to your component as loader data
  return {myHost};
}

const countryCodeList: TCountryCode[] = Object.keys(
  countriesList,
) as TCountryCode[];
// const shopifyCountryCodeList: CountryCode[] = countryCodeList as CountryCode[];
// const shopifyLanguageCodeList: LanguageCode[] = Object.keys(
//   languages,
// ) as LanguageCode[];

const countriesListData: ICountryData[] = countryCodeList.map((code) => {
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
    language: 'EN',
    country: 'US',
    label: 'United States (USD $)',
    // I want to use the myHost variable from the loader function
    // to set the host dynamically
    host: '',
    pathPrefix: '/us',
  },
  // 'fr': {
  //   language: 'FR',
  //   country: 'FR',
  //   label: 'France (EUR €)',
  //   host: 'hydrogen.fr',
  //   pathPrefix: '/fr',
  // },
  // Help me to build the countriesList object with all countries and languages
  ...countriesListData.reduce(
    (acc, country) => {
      const language = country.languages?.[0]?.toUpperCase() as LanguageCode || 'EN';
      const countryCode = country.iso2 as TCountryCode;
      acc[`${countryCode.toLowerCase()}`] = {
        language: language as LanguageCode,
        country: countryCode as CountryCode,
        label: `${country.name} (${country.currency})`,
        host: '',
        pathPrefix: `/${country.iso2.toLowerCase()}`,
      };
      return acc;
    },
    {} as Record<string, Locale>,
  ),
  // Add more as needed
};
