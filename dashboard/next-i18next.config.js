module.exports = {
  i18n: {
    ...require("./next.config").i18n,
    localePath: require("path").resolve("./public/locales"),
  },
  returnObjects: true,
};
