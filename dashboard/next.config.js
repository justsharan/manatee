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
  async redirects() {
    return [
      {
        source: "/invite",
        destination:
          "https://discord.com/oauth2/authorize?scope=applications.commands%20bot&client_id=643103079679393792&permissions=164752486",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/PMzqbaVEsH",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
