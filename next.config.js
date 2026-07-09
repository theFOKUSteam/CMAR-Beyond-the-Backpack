/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow optimizing locally-hosted placeholder/mockup images.
    // Add remote domains here if you host final photos on an external CMS/CDN.
    remotePatterns: []
  }
};

module.exports = nextConfig;
