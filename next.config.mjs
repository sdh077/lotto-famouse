/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'naverbooking-phinf.pstatic.net',
        port: '',
        pathname: '/**',
      }, {
        protocol: 'http',
        hostname: 'blogfiles.naver.net',
        port: '',
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;