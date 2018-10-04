# react-native-less-transformerc[![NPM version](http://img.shields.io/npm/v/react-native-less-transformer.svg)](https://www.npmjs.org/package/react-native-less-transformer) [![Downloads per month](https://img.shields.io/npm/dm/react-native-less-transformer.svg)](http://npmcharts.com/compare/react-native-less-transformer?periodLength=30) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

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
```

**React Native CSS modules using [className](https://github.com/kristerkari/babel-plugin-react-native-classname-to-style) property:**

```jsx
<MyElement className={styles.myClass} />
```

**React Native CSS modules using [styleName](https://github.com/kristerkari/babel-plugin-react-native-stylename-to-style) property:**

```jsx
<MyElement styleName="myClass my-dashed-class" />
```

## Installation and configuration

_Minimum React Native version for this transformer is 0.52. If you are using an older version, please update to a newer React Native version before trying to use this transformer._

### Step 1: Install

```sh
yarn add --dev react-native-less-transformer less
```

### Step 2: Configure the react native packager

#### For React Native v0.57 or newer

Add this to `rn-cli.config.js` in your project's root (create the file if it does not exist already):

```js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-less-transformer")
    },
    resolver: {
      sourceExts: [...sourceExts, "less"]
    }
  };
})();
```

---

#### For React Native v0.56 or older

Add this to `rn-cli.config.js` in your project's root (create the file if it does not exist already):

```js
module.exports = {
  getTransformModulePath() {
    return require.resolve("react-native-less-transformer");
  },
  getSourceExts() {
    return ["js", "jsx", "less"];
  }
};
```

...or if you are using [Expo](https://expo.io/), in `app.json`:

```json
{
  "expo": {
    "packagerOpts": {
      "sourceExts": ["js", "jsx", "less"],
      "transformer": "node_modules/react-native-less-transformer/index.js"
    }
  }
}
```

## Dependencies

This library has the following Node.js modules as dependencies:

- [app-root-path](https://github.com/inxilpro/node-app-root-path)
- [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform)
- [semver](https://github.com/npm/node-semver#readme)
