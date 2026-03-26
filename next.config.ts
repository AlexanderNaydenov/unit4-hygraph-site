import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "eu-central-1-shared-euc1-02.graphassets.com",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
  async headers() {
    return [
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.hygraph.com https://app.hygraph.com https://hygraph.com",
          },
        ],
        source: "/:path*",
      },
    ];
  },
};

export default nextConfig;
