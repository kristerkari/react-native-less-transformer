var less = require("less");
var semver = require("semver");
var path = require("path");
var appRoot = require("app-root-path");
var css2rn = require("css-to-react-native-transform").default;

var upstreamTransformer = null;

var reactNativeVersionString = require("react-native/package.json").version;
var reactNativeMinorVersion = semver(reactNativeVersionString).minor;

if (reactNativeMinorVersion >= 59) {
  upstreamTransformer = require("metro-react-native-babel-transformer");
} else if (reactNativeMinorVersion >= 56) {
  upstreamTransformer = require("metro/src/reactNativeTransformer");
} else if (reactNativeMinorVersion >= 52) {
  upstreamTransformer = require("metro/src/transformer");
} else if (reactNativeMinorVersion >= 47) {
  upstreamTransformer = require("metro-bundler/src/transformer");
} else if (reactNativeMinorVersion === 46) {
  upstreamTransformer = require("metro-bundler/build/transformer");
} else {
  // handle RN <= 0.45
  var oldUpstreamTransformer = require("react-native/packager/transformer");
  upstreamTransformer = {
    transform({ src, filename, options }) {
      return oldUpstreamTransformer.transform(src, filename, options);
    }
  };
}

function renderToCSS({ src, filename, options = {} }) {
  var { lessOptions = {} } = options;
  var lessPromise = new Promise((resolve, reject) => {
    less
      .render(src, { paths: [path.dirname(filename), appRoot], ...lessOptions })
      .then(result => {
        resolve(result.css);
      })
      .catch(reject);
  });
  return lessPromise;
}

function renderCSSToReactNative(css) {
  return css2rn(css, { parseMediaQueries: true });
}

function defaultTemplate(cssObject) {
  return "module.exports = " + JSON.stringify(cssObject);
}

module.exports.transform = function(src, filename, options, template) {
  if (typeof src === "object") {
    // handle RN >= 0.46
    ({ src, filename, options, template } = src);
  }

  if (filename.endsWith(".less")) {
    return renderToCSS({ src, filename, options }).then(css => {
      var cssObject = renderCSSToReactNative(css);
      return upstreamTransformer.transform({
        src: template ? template(cssObject) : defaultTemplate(cssObject),
        filename,
        options
      });
    });
  }
  return upstreamTransformer.transform({ src, filename, options });
};

module.exports.renderToCSS = renderToCSS;
