
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_TOKEN;

export async function getProducts() {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("Shopify environment variables are missing.");
  }

  const query = `
    query GetProducts {
      products(first: 24) {
        edges {
          node {
            id
            title
            handle
            description
            vendor
            productType
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors || !result.data?.products) {
    throw new Error("Unable to fetch Shopify products.");
  }

  return result.data.products.edges.map(({ node }) => ({
    id: node.id,
    name: node.title,
    handle: node.handle,
    description: node.description,
    category: node.productType || node.vendor || "Toy",
    line: node.vendor || node.productType || "",
    image: node.featuredImage?.url || "",
    imageAlt: node.featuredImage?.altText || node.title,
    price: node.priceRange.minVariantPrice.amount,
    currency: node.priceRange.minVariantPrice.currencyCode,
    url: `https://${SHOPIFY_STORE_DOMAIN}/products/${node.handle}`,
  }));
}

export async function getProduct(handle) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("Shopify environment variables are missing.");
  }

  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        vendor
        productType
        availableForSale

        media(first: 20) {
          edges {
            node {
              __typename

              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }

              ... on Video {
                sources {
                  url
                  mimeType
                }
              }

              ... on ExternalVideo {
                embeddedUrl
              }
            }
          }
        }

        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error("Unable to fetch Shopify product.");
  }

  const product = result.data?.product;

  if (!product) {
    return null;
  }

  return {
    ...product,
    variants: product.variants.edges.map(({ node }) => node),
  };
}


export async function getProductCategories() {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("Shopify environment variables are missing.");
  }

  const categories = new Set();
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const query = `
      query GetProductCategories($cursor: String) {
        products(first: 250, after: $cursor) {
          edges {
            node {
              productType
              vendor
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: { cursor },
        }),
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify request failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors || !result.data?.products) {
      throw new Error("Unable to fetch Shopify product categories.");
    }

    result.data.products.edges.forEach(({ node }) => {
      const category = node.productType?.trim() || node.vendor?.trim();

      if (category) {
        categories.add(category);
      }
    });

    hasNextPage = result.data.products.pageInfo.hasNextPage;
    cursor = result.data.products.pageInfo.endCursor;
  }

  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

