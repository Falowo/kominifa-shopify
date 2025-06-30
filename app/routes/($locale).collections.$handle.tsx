import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {ProductItemFragment} from 'storefrontapi.generated';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {useState} from 'react';
import WhatsappButton from '~/components/WhatsappButton';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `Kominifa shop | ${data?.collection.title ?? ''} Collection`},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle, locale} = params;

  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 40, // the maximum number of products to fetch per page
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  // If the locale param is missing or doesn't match the expected locale, redirect

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});
  // redirectIfCountryKeyChanged({pathname});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  // Import the Collection type from your generated GraphQL types

  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );

  const collections: Pick<CollectionItemFragment, 'handle' | 'id' | 'title'>[] =
    collection.products.nodes.reduce(
      (acc, product) => {
        product.collections.nodes.forEach((collectionNode) => {
          // the collection.handle referred to the main collection from the useLoaderData to make sure we don't duplicate it
          if (
            !acc.some((c) => c.id === collectionNode.id) &&
            collectionNode.handle !== collection.handle
          ) {
            acc.push({
              id: collectionNode.id,
              handle: collectionNode.handle,
              title: collectionNode.title,
            });
          }
        });
        return acc;
      },
      [] as Pick<CollectionItemFragment, 'handle' | 'id' | 'title'>[],
    );

  // Filter products by selected collection
  const filteredProducts = selectedCollection
    ? collection.products.nodes.filter((product) =>
        product.collections.nodes.some(
          (col) => col.handle === selectedCollection,
        ),
      )
    : collection.products.nodes;

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      {collection.handle === 'clothing' && (
        <WhatsappButton
          to="fr"
          message="Please contact us to personalize (free of charge), your Odù, your text, your favorite colors. We will send you a private link with your model so you can preview it."
        />
      )}

      {/* Collection filter menu */}

      <div className="collections-filter m-4">
        <button
          className={`mr-2 px-2 py-1 rounded ${!selectedCollection ? 'bg-black text-white' : 'bg-gray-200'}`}
          onClick={() => setSelectedCollection(null)}
        >
          All
        </button>
        {collections.map((col) => (
          <button
            key={col.id}
            className={`mr-2 px-2 py-1 rounded ${selectedCollection === col.handle ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedCollection(col.handle)}
          >
            {col.title}
          </button>
        ))}
      </div>
      <PaginatedResourceSection
        connection={{...collection.products, nodes: filteredProducts}}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 16 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    collections(first: 10) {
      nodes {
        id
        handle
        title
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
