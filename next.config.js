const locales = ["en", "ko"];
const defaultLocale = "en";

// Make all rewrites for locales
const makeLocaleRewrite = (l) => ({
  source: "/posts/:slug*",
  has: [
    {
      type: "cookie",
      key: "blog-lang",
      value: l,
    },
  ],
  destination: `/posts/:slug*/${l}`,
});

module.exports = {
  async rewrites() {
    return {
      beforeFiles: locales.map(makeLocaleRewrite),
      fallback: [
        {
          source: "/posts/:slug*",
          destination: `/posts/:slug*/${defaultLocale}`,
        },
      ],
    };
  },
};
