import {createContext, useContext, useState, ReactNode} from 'react';
// import {useLocation, useNavigate} from 'react-router-dom';
import {
  type CountriesKey,
  type Locale,
  countries,
  isValidCountryKey,
} from '~/data/countries';
// import {redirect} from '@shopify/remix-oxygen';

const CountryContext = createContext<{
  country: Locale;
  setCountry: (country: Locale) => void;
}>({country: countries['us'], setCountry: () => {}});

export function CountryProvider({
  children,
  initialCountry = countries['us'] as Locale,
}: {
  children: ReactNode;
  initialCountry?: Locale;
}) {
  const [country, setCountry] = useState<Locale>(initialCountry as Locale);
  // const navigate = useNavigate();
  // const location = useLocation();
  // const currentCountry = countries[countryKey];
  // const onLocationChange = () => {
  //   const locationPath = location.pathname.toLowerCase();
  //   if (
  //     locationPath.split('/')[1] !==
  //     `/${currentCountry.language.toLowerCase()}-${currentCountry.country.toLowerCase()}`
  //   ) {
  //     const toBeTestedCountryKey = locationPath.split('/')[1] as CountriesKey;
  //     if (!isValidCountryKey(toBeTestedCountryKey)) {
  //       redirect(
  //         `/${currentCountry.language.toLowerCase()}-${currentCountry.country.toLowerCase()}${location.pathname}${location.search}`,
  //       );
  //     } else {
  //       console.log(
  //         `Country key ${toBeTestedCountryKey} is valid, updating state.`,
  //       );
  //     }
  //   }
  // };

  console.log('CountryProvider initialized with:', country);
  return (
    <CountryContext.Provider value={{country, setCountry}}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}

// This component provides a context for managing the selected country.
// It initializes the country state with a default value (fr) and provides a way to update it.
// The `useCountry` hook allows other components to access and update the country state.
