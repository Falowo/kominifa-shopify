import React, { createContext, useContext, useState, ReactNode } from 'react';



const CountryContext = createContext<{
  country: string;
  setCountry: (country: string) => void;
}>({ country: 'us', setCountry: () => {} });

export function CountryProvider({ children, initialCountry = 'us' }: { children: ReactNode; initialCountry?: string }) {
  const [country, setCountry] = useState(initialCountry);
  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}

// This component provides a context for managing the selected country.
// It initializes the country state with a default value (US) and provides a way to update it.
// The `useCountry` hook allows other components to access and update the country state.