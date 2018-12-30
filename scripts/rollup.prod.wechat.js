import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

import baseConfig from './rollup.base'
import { version, author } from '../package.json'

let name = 'wechat';
const banner =
  `${'/*!\n' + ' * '}Appdb v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()} ${author}\n` +
  ` * Released under the MIT License.\n` +
  ` */`

export default [
  {
    input: `src/${name}.js`,
    output: [
      {
        file: `build/${name}.js`,
        format: 'umd',
        name,
        banner,
        sourcemap: true
      },
      // cjs and esm version
      {
        file: `build/${name}.cjs.js`,
        format: 'cjs',
        banner
      },
      // cjs and esm version
      {
        file: `build/${name}.esm.js`,
        format: 'es',
        banner
      }
    ],
    plugins: [...baseConfig.plugins, filesize()]
  },
  // .min.js
  {
    input: `src/${name}.js`,
    output: [
      // umd with compress version
      {
        file: `${name}.js`,
        format: 'umd',
        name,
        banner
      }
    ],
    plugins: [
      ...baseConfig.plugins,
      uglify(
        {
          compress: {
            drop_console: true
          }
        },
        minify
      ),
      filesize()
    ]
  }
]
