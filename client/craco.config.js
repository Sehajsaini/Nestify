const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps for CSS
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.use) {
              oneOfRule.use.forEach(loader => {
                if (loader.loader && loader.loader.includes('css-loader')) {
                  loader.options.sourceMap = false;
                }
                if (loader.loader && loader.loader.includes('postcss-loader')) {
                  loader.options.sourceMap = false;
                }
              });
            }
          });
        }
      });

      // Remove source-map-loader if present
      webpackConfig.module.rules = webpackConfig.module.rules.filter(rule => {
        if (rule.loader && rule.loader.includes('source-map-loader')) {
          return false;
        }
        return true;
      });

      return webpackConfig;
    }
  }
};
