const less = require("less");
const path = require("path");
const appRoot = require("app-root-path");
const css2rn = require("css-to-react-native-transform").default;

/**
 * `metro-react-native-babel-transformer` has recently been migrated to the React Native
 * repository and published under the `@react-native/metro-babel-transformer` name.
 * The new package is default on `react-native` >= 0.73.0, so we need to conditionally load it.
 *
 * Additionally, Expo v50.0.0 has begun using @expo/metro-config/babel-transformer as its upstream transformer.
 * To avoid breaking projects, we should prioritze that package if it is available.
 */
const upstreamTransformer = (() => {
  try {
    return require("@expo/metro-config/babel-transformer");
  } catch (error) {
    try {
      return require("@react-native/metro-babel-transformer");
    } catch (error) {
      return require("metro-react-native-babel-transformer");
    }
  }
})();

function renderToCSS({ src, filename, options = {} }) {
  const { lessOptions = {} } = options;
  const lessPromise = new Promise((resolve, reject) => {
    less
      .render(src, { paths: [path.dirname(filename), appRoot], ...lessOptions })
      .then((result) => {
        resolve(result.css);
      })
      .catch(reject);
  });
  return lessPromise;
}

function renderCSSToReactNative(css) {
  return css2rn(css, { parseMediaQueries: true });
}

module.exports.transform = ({ src, filename, ...rest }) => {
  if (filename.endsWith(".less")) {
    return renderToCSS({ src, filename, ...rest }).then((css) => {
      const cssObject = renderCSSToReactNative(css);
      return upstreamTransformer.transform({
        src: "module.exports = " + JSON.stringify(cssObject),
        filename,
        ...rest
      });
    });
  }
  return upstreamTransformer.transform({ src, filename, ...rest });
};

module.exports.renderToCSS = renderToCSS;
