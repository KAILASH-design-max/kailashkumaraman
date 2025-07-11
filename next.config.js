/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Changed from true
  },
  eslint: {
    ignoreDuringBuilds: false, // Changed from true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.grofers.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'freepngimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'banner2.cleanpng.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shop.mtrfoods.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Added new domain
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'icon2.cleanpng.com', // Added new domain
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // Added for the new banner image
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdmntprwestus.oaiusercontent.com', // Added for the new banner image
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.clevelandclinic.org',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;
