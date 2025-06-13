// Virtual entry point for the app
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from '~/lib/context';


/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      const response = await handleRequest(request);

      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
// import {createStorefrontClient} from '@shopify/hydrogen';
// import {
//   createRequestHandler,
//   getStorefrontHeaders,
// } from '@shopify/remix-oxygen';
// import {getLocaleFromRequest} from '~/lib/utils';

// export default {
//   async fetch({
//     request,
//     env,
//     executionContext,
//   }: {
//     request: Request;
//     env: Env;
//     executionContext: ExecutionContext;
//   }) {
//     const {storefront} = createStorefrontClient({
//       publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
//       privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
//       storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
//       storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION,
//       i18n: getLocaleFromRequest(request), // <-- Locale detection here
//       storefrontHeaders: getStorefrontHeaders(request),
//       cache: await caches.open('hydrogen'),
//       waitUntil: (promise) => executionContext.waitUntil(promise),
//     });

//     const handleRequest = createRequestHandler({
//       mode: process.env.NODE_ENV,
//       getLoadContext: () => ({storefront}),
//     });

//     return handleRequest(request);
//   },
// };
