## v1.2.1

- Fixed: call to `renderToCSS` was missing parameters.

## v1.2.0

- Added: `renderToCSS` method. It can be used together with the PostCSS transformer to add support for CSS variables.

## v1.1.6

- Updated: `semver` dependency to v5.6.0.
- Updated: `css-to-react-native-transform` dependency to v1.8.1.

## v1.1.5

- Fixed: Compatibility with react-native v0.59

## v1.1.4

- Fixed: added missing dependency `app-root-path` to `package.json`.

## v1.1.3

- Fixed: `@import` was not working because missing `paths` setting.

## v1.1.2

- Updated: `css-to-react-native-transform` dependency to v1.7.0.

## v1.1.1

- Fixed: Compatibility with react-native v0.56

## v1.1.0

- Updated: `css-to-react-native-transform` dependency to v1.6.0.
- Added: enabled parsing of CSS viewport units (does not work without `babel-plugin-react-native-classname-to-dynamic-style`).

## v1.0.0

- Initial release
