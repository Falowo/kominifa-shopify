import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {redirect} from 'react-router';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    redirect(`/${params.locale.toLowerCase()}/`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Security-Policy': "default-src 'self'",
      },
    });
    return null;
  }
  

}
