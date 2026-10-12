import type {NextConfig} from 'next';

// Dynamically extract and append APP_URL host to allowed origins for Server Actions
const allowedOrigins = [
  'localhost:3000',
  '**.run.app',
  '**.asia-east1.run.app',
];

if (process.env.APP_URL) {
  try {
    const url = new URL(process.env.APP_URL);
    if (url.host && !allowedOrigins.includes(url.host)) {
      allowedOrigins.push(url.host);
    }
  } catch (e) {
    console.error('Failed to parse APP_URL in next.config.ts', e);
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  experimental: {
    serverActions: {
      allowedOrigins
    }
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
