/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
nr dev dom

# specify the format to output
nr dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false nr dev
```
*/

const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')
const args = require('minimist')(process.argv.slice(2))
// 输出目标(前面不带-)：默认是Vue
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
// esm/cjs/global(iife)
const formats = args.formats || args.f
// 映射文件
const sourceMap = args.sourcemap || args.s
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`,
      sourceMap ? `SOURCE_MAP:true` : ``
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
