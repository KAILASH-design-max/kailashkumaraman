
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.grofers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'freepngimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'banner2.cleanpng.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shop.mtrfoods.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Added new domain
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'icon2.cleanpng.com', // Added new domain
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // Added for the new banner image
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdmntprwestus.oaiusercontent.com', // Added for the new banner image
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.clevelandclinic.org',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
