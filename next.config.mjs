/** @type {import('next').NextConfig} */
const nextConfig = {
	// The following environment variables can be safely exposed to the public bundle.
	// The Storyblok public access token is required for features like live preview.
	env: {
		STORYBLOK_DELIVERY_API_TOKEN: process.env.STORYBLOK_DELIVERY_API_TOKEN,
		STORYBLOK_API_BASE_URL: process.env.STORYBLOK_API_BASE_URL,
		STORYBLOK_REGION: process.env.STORYBLOK_REGION,
	},

	images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.elc.co.uk",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        pathname: "/**",
      },
			{
				protocol: "https",
				hostname: "www.addoplay.com",
				pathname: "/**",
			},
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
