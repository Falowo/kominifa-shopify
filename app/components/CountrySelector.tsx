// File: app/components/CountrySelector.tsx

import {useNavigate, useLocation, useMatches} from 'react-router';
// import type {Locale} from '~/data/countries';
import {countries, CountriesKey} from '~/data/countries';
import {useCountry} from './CountryProvider';
// import {useCountryKey} from './CountryKeyProvider';
import {useEffect, useState, useTransition} from 'react';
import {CartForm} from '@shopify/hydrogen';
import { CountryCode } from '@shopify/hydrogen/customer-account-api-types';

export function CountrySelector() {
  const {country, setCountry} = useCountry();
  const matches = useMatches();
  const rootData = matches.find((m) => m.id === 'root')?.data as {
    selectedLocale?: {pathPrefix: string; country: string; language: string};
    
  };
  const navigate = useNavigate();
  const location = useLocation();
  
  const [value, setValue] = useState(
    rootData?.selectedLocale?.country.toLowerCase() || 'default',
  ); // Default to 'default' if no country is set

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
   const newCountryCode = event.target.value.toUpperCase() as CountryCode;
        setValue(event.target.value); // Update the value based on the selected country
        setCountry(countries[event.target.value.toLowerCase() as CountriesKey]);

// Prepare the cartFormInput payload
    const cartFormInput = {
      action: CartForm.ACTIONS.BuyerIdentityUpdate,
      inputs: {
        buyerIdentity: {
          countryCode: newCountryCode,
        },
      },
    };

    // Send a fetch POST request to the cart action endpoint
try {
    await fetch('/cart', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        cartFormInput: JSON.stringify(cartFormInput),
      }),
    });} catch (error) {
      console.error('Error updating cart buyer identity:', error);
    }

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
