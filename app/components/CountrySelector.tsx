import {useNavigate, useLocation, useMatches} from 'react-router';
// import type {Locale} from '~/data/countries';
import {countries, CountriesKey} from '~/data/countries';
import {useCountry} from './CountryProvider';
// import {useCountryKey} from './CountryKeyProvider';
import {useEffect, useState, useTransition} from 'react';

export function CountrySelector() {
  const [isPending, startTransition] = useTransition();
  const {country, setCountry} = useCountry();
  const matches = useMatches();
  const rootData = matches.find((m) => m.id === 'root')?.data as {
    selectedLocale?: {pathPrefix: string; country: string; language: string};
    cartHandler?: {
      updateBuyerIdentity: (buyerIdentity: {
        countryCode: string;
      }) => Promise<void>;
    };
  };
  const navigate = useNavigate();
  const location = useLocation();
  // const {countryKey, setCountryKey} = useCountryKey();
  // console.log('CountrySelector:', {countryKey}, {i18n});
  // const currentCountry = useMemo(() => countries[countryKey], [countryKey]);
  // console.log('Current country:', currentCountry);
  const [value, setValue] = useState(
    rootData?.selectedLocale?.country.toLowerCase() || 'default',
  ); // Default to 'default' if no country is set

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if ((event.target.value.toLowerCase() as CountriesKey) !== value) {
      startTransition(() => {
        // Update the country in the context
       
        setValue(event.target.value); // Update the value based on the selected country
        setCountry(countries[event.target.value.toLowerCase() as CountriesKey]);

        // Update the country in the context
      });
      const newCountry =
        countries[event.target.value.toLowerCase() as keyof typeof countries];
      const newPrefix =
        newCountry.country === countries['default'].country
          ? ''
          : `/${newCountry.language.toLowerCase()}-${newCountry.country.toLowerCase()}`;
      // ensure we strip any old prefix from the path
      const strippedPath = location.pathname.replace(
        /^\/[a-z]{2}-[a-z]{2}/, // Regex to match the old prefix (e.g., /en-us)
        '',
      );

      const newPath = `${newPrefix}${strippedPath}${location.search}`;

      // If on a different page, we need to handle the path accordingly
      console.log('New path :', newPath);
      navigate(newPath);
    }
  };

  useEffect(() => {
    // Initialize the country based on the root data
    const initialCountry = countries[value.toLowerCase() as CountriesKey];
    if (initialCountry) {
      setCountry(initialCountry);
    }
  }, [value, setCountry]);

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{
        width: '88px',
        minWidth: '88px',
        maxWidth: '88px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {Object.entries(countries).map(([code, country]) => (
        <option
          className="text-black"
          key={code}
          value={`${country.country.toLowerCase()}`}
        >
          {country.label}
        </option>
      ))}
    </select>
  );
}
// This component allows users to select a country from a dropdown.
