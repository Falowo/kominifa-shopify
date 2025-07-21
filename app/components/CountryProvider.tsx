import {createContext, useContext, useState, ReactNode} from 'react';
import {
  type Locale,
  countries,
} from '~/data/countries';

const CountryContext = createContext<{
  country: Locale;
  setCountry: (country: Locale) => void;
}>({country: countries['default'], setCountry: () => {}});

export function CountryProvider({
  children,
  initialCountry = countries['default'] as Locale,
}: {
  children: ReactNode;
  initialCountry?: Locale;
}) {
  const [country, setCountry] = useState<Locale>(initialCountry as Locale);
 

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

