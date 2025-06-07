
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
    ],
  },
};

export default nextConfig;


    