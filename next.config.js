/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  emotion: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: {
        loader: "@svgr/webpack",
        options: {
          titleProp: true,
          titleId: "filePath",
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
