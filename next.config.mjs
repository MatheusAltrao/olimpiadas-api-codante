/** @type {import('next').NextConfig} */
const nextConfig = {
  /*  images: {
    domains: ['codante.s3.amazonaws.com', 'olympics.com'],
  },
 */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "codante.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "olympics.com",
      },
    ],
  },

  /* async redirects() {
    return [
      {
        source: "/",
        destination: "/home/ranking",
        permanent: true,
      },
    ];
  }, */
};

export default nextConfig;
