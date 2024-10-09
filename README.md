# react-native-less-transformer [![NPM version](http://img.shields.io/npm/v/react-native-less-transformer.svg)](https://www.npmjs.org/package/react-native-less-transformer) [![Downloads per month](https://img.shields.io/npm/dm/react-native-less-transformer.svg)](http://npmcharts.com/compare/react-native-less-transformer?periodLength=30) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Use [Less](http://lesscss.org/) to style your React Native apps.

Behind the scenes the `.less` files are transformed to [react native style objects](https://facebook.github.io/react-native/docs/style.html) (look at the examples).

> This transformer can be used together with [React Native CSS modules](https://github.com/kristerkari/react-native-css-modules).

## How does it work?

Your `App.less` file might look like this:

```less
@nice-blue: #5b83ad;
@light-blue: @nice-blue + #111;

.myClass {
  color: @light-blue;
}
.myOtherClass {
  color: red;
}
.my-dashed-class {
  color: green;
}
```

When you import your stylesheet:

```js
import styles from "./App.less";
```

Your imported styles will look like this:

```js
var styles = {
  myClass: {
    color: "#6c94be"
  },
  myOtherClass: {
    color: "red"
  },
  "my-dashed-class": {
    color: "green"
  }
};
```

You can then use that style object with an element:

**Plain React Native:**

```jsx
<MyElement style={styles.myClass} />

<MyElement style={styles["my-dashed-class"]} />
```

**[React Native CSS modules](https://github.com/kristerkari/react-native-css-modules) using [className](https://github.com/kristerkari/babel-plugin-react-native-classname-to-style) property:**

```jsx
<MyElement className={styles.myClass} />

<MyElement className={styles["my-dashed-class"]} />
```

**[React Native CSS modules](https://github.com/kristerkari/react-native-css-modules) using [styleName](https://github.com/kristerkari/babel-plugin-react-native-stylename-to-style) property:**

```jsx
<MyElement styleName="myClass my-dashed-class" />
```

## Installation and configuration

_Minimum React Native version for this transformer is 0.52. If you are using an older version, please update to a newer React Native version before trying to use this transformer._

### Step 1: Install

```sh
npm install --save-dev react-native-less-transformer less
```

or

```sh
yarn add --dev react-native-less-transformer less
```

### Step 2: Configure the react native packager

#### For Expo SDK v41.0.0 or newer

Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

`metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-less-transformer")
  };
  config.resolver = {
    ...resolver,
    sourceExts: [...resolver.sourceExts, "less"]
  };

  return config;
})();
```

---

#### For React Native v0.72.1 or newer

Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

`metro.config.js`:

```js
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-less-transformer")
  },
  resolver: {
    sourceExts: [...sourceExts, "less"]
  }
};

module.exports = mergeConfig(defaultConfig, config);
```

## LESS options

If you need to pass options (e.g. plugins) to `less`, you can do so by creating a `transformer.js` file and doing the following:

```js
const upstreamTransformer = require("@react-native/metro-babel-transformer");
const lessTransformer = require("react-native-less-transformer");

module.exports.transform = function ({ src, filename, options, ...rest }) {
  if (filename.endsWith(".less")) {
    var opts = Object.assign(options, {
      lessOptions: {
        plugins: [require("less-plugin-glob")]
      }
    });
    return lessTransformer.transform({ src, filename, options: opts, ...rest });
  } else {
    return upstreamTransformer.transform({ src, filename, options, ...rest });
  }
};
```

After that in `metro.config.js` point the `babelTransformerPath` to that file:

```diff
-require.resolve("react-native-less-transformer")
+require.resolve("./transformer.js")
```

## CSS Custom Properties (CSS variables)

_You need version 1.2.1 or newer_

```css
:root {
  --text-color: blue;
}

.blue {
  color: var(--text-color);
}
```

CSS variables are not supported by default, but you can add support for them by using [PostCSS](https://postcss.org/) and [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables#readme) plugin.

Start by installing dependencies:

```sh
npm install postcss postcss-css-variables react-native-postcss-transformer --save-dev
```

or

```sh
yarn add postcss postcss-css-variables react-native-postcss-transformer --dev
```

Add `postcss-css-variables` to your PostCSS configuration with [one of the supported config formats](https://github.com/michael-ciniawsky/postcss-load-config), e.g. `package.json`, `.postcssrc`, `postcss.config.js`, etc.

After that create a `transformer.js` file and do the following:

```js
const upstreamTransformer = require("@react-native/metro-babel-transformer");
const lessTransformer = require("react-native-less-transformer");
const postCSSTransformer = require("react-native-postcss-transformer");

module.exports.transform = function ({ src, filename, ...rest }) {
  if (filename.endsWith(".less")) {
    return lessTransformer
      .renderToCSS({ src, filename, options })
      .then((css) =>
        postCSSTransformer.transform({ src: css, filename, ...rest })
      );
  } else {
    return upstreamTransformer.transform({ src, filename, ...rest });
  }
};
```

After that in `metro.config.js` point the `babelTransformerPath` to that file:

```diff
-require.resolve("react-native-less-transformer")
+require.resolve("./transformer.js")
```

## Dependencies

This library has the following Node.js modules as dependencies:

- [app-root-path](https://github.com/inxilpro/node-app-root-path)
- [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform)
