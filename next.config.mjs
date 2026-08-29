/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.dealshare.pl"
          }
        ],
        destination: "https://dealshare.pl/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
