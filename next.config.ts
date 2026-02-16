import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["app.bdwebai.com", "sweepstake.webjuwa.com", "app.socialspins777.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.bdwebai.com',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'sweepstake.webjuwa.com',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'app.socialspins777.com',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'app.socialspins777.com',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
