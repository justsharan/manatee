/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: "/invite",
        destination:
          "https://discord.com/oauth2/authorize?client_id=643103079679393792&permissions=164752486&scope=applications.commands%20bot",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.com/invite/NP7F78SMzB",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
