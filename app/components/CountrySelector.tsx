import {useLoaderData, useNavigate, useLocation} from 'react-router-dom';
import type {Locale} from '~/data/countries';
import {countries} from 'countries-list';
import {useCountry} from './CountryProvider';

export function CountrySelector() {
  const {selectedLocale} = useLoaderData() as {selectedLocale: Locale};
  const navigate = useNavigate();
  const location = useLocation();
  const countryList = Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name,
  }));
  const {country, setCountry} = useCountry();
  const oldPrefix = country
    ? `/${country.toLowerCase()}`
    : selectedLocale?.pathPrefix
      ? selectedLocale?.pathPrefix
      : '/us';
  console.log('Old Prefix:', oldPrefix);
  console.log('Selected Locale:', selectedLocale);
  console.log('Country:', country);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value.toLowerCase();
    console.log('New Locale:', newLocale);
    const strippedPath = location.pathname.replace(oldPrefix, '');
    console.log('Stripped Path:', strippedPath);
    navigate(`/${newLocale}${strippedPath}${location.search.toLowerCase()}`);
    setCountry(newLocale);
  };

  console.log('Selected Locale:', selectedLocale);
  console.log('Current Country:', country);
  console.log('Country List:', countryList);
  console.log('Old Path Prefix:', oldPrefix);
  return (
    <select defaultValue={country} onChange={handleChange}>
      {countryList.map(({code, name}) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
// This component allows users to select a country from a dropdown.
// It uses the `useLoaderData` hook to get the current locale and updates the URL when a new country is selected.
// The `countries-list` package is used to get the list of countries.
// The `useNavigate` and `useLocation` hooks from React Router are used to handle navigation and get the current path.
