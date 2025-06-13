import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {getLocaleFromRequest} from './utils';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {
      language: getLocaleFromRequest(request)?.language ?? "EN",
      country: getLocaleFromRequest(request)?.country ?? "US",
    },
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  console.log('Hydrogen context created:', hydrogenContext);
  console.log('i18n language:', hydrogenContext.storefront.i18n.language);
  console.log('i18n country:', hydrogenContext.storefront.i18n.country);
  console.log('Request URL:', request.url);
  console.log('Locale from request:', getLocaleFromRequest(request));

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
  };
}
