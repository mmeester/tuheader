
import { text } from './build/banner.json'
import packageInfo from './package.json'

import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import node from '@rollup/plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser'

import fs from 'fs'
import path from 'path'

const baseFolderPath = './src/components/'
const banner = text.replace('${version}', packageInfo.version)

const components = fs
  .readdirSync(baseFolderPath)
  .filter((f) =>
    fs.statSync(path.join(baseFolderPath, f)).isDirectory()
  )

const entries = {
  'index': 'main.js',
  ...components.reduce((obj, name) => {
    obj[name] = (baseFolderPath + name)
    return obj
  }, {})
}

const babelOptions = {
  babelHelpers: 'bundled'
}

const vuePluginConfig = {
  css: false,
  template: {
    isProduction: true,
    compilerOptions: {
      whitespace: 'condense'
    }
  }
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


export default () => {
  let config = [{
    input: 'main.js',
    output: {
      format: 'esm',
      file: 'dist/tu-header.js',
      banner: banner
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      // commonjs(), // add support for CommonJS modules
      node({
        extensions: ['.vue', '.ts']
      }),
      css({ output: 'assets/tu-header.css' }),
      vue({ css: false }),

    ]
  }]

  if (process.env.MINIFY === 'true') {
    config = config.filter((c) => !!c.output.file)
    config.forEach((c) => {
      c.output.file = c.output.file.replace(/\.m?js/g, r => `.min${r}`)
      c.plugins.push(terser({
        output: {
          comments: '/^!/'
        }
      }))
    })
  }
  return config
}