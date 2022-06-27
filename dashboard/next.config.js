/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en-US", "fr"],
    defaultLocale: "en-US",
  },
  images: {
    domains: ["cdn.discordapp.com"],
  },
};

module.exports = nextConfig;
