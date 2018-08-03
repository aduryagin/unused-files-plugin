# UnusedFilesPlugin
[![npm version](https://badge.fury.io/js/unused-files-plugin.svg)](https://badge.fury.io/js/unused-files-plugin)

Show or remove all files that are not compiled by webpack under webpack's context.

## Options
```javascript
plugins: [
  ...
  new UnusedFilesPlugin({
    remove: false,
    folders: [
      path.resolve(__dirname, '../../client'),
      path.resolve(__dirname, '../../server'),
    ],
    ignore: [/node_modules/, /\.DS_Store/, /__mocks__/, /__tests?__/],
  })
],
```
* `remove`: Remove or not unused files. The default value is `false`
* `ignore`: Array of regexp for ignore paths. The default value is `[/node_modules/, /\.DS_Store/, /__tests?__/]`
* `folders`: Array of paths with source code.
