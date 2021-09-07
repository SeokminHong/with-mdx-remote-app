const locales = ["en", "ko"];

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
    return locales.map(makeLocaleRewrite);
  },
};
