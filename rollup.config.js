import fs from "fs";
import path from "path";
import vue from "rollup-plugin-vue";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import minimist from "minimist";
import url from "@rollup/plugin-url";
import { terser } from "rollup-plugin-terser";
import css from 'rollup-plugin-css-only';

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, ".");

let postVueConfig = [
  url({
      include: [
        '**/*.svg',
        '**/*.png',
        '**/*.gif',
        '**/*.jpg',
        '**/*.jpeg'
      ]
    }),
    css({ output: 'assets/tu-header.css' }),
]

const baseConfig = {
  plugins: {
    preVue: [
      alias({
        entries: [
          {
            find: "@",
            replacement: `${path.resolve(projectRoot, "src")}`
          }
        ],
        customResolver: resolve({
          extensions: [".js", ".jsx", ".vue"]
        })
      })
    ],
    replace: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    },
    vue: {
      target: "browser",
      css: false,
    },
    postVue: [
      ...postVueConfig
    ],
    babel: {
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".vue"],
      babelHelpers: "bundled"
    }
  }
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  "vue"
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: "Vue"
};

const baseFolder = "./src/";
const componentsFolder = "components/";

const components = fs
  .readdirSync(baseFolder + componentsFolder)
  .filter(f =>
    fs.statSync(path.join(baseFolder + componentsFolder, f)).isDirectory()
  );

const entriespath = {
  index: "./main.js",
  ...components.reduce((obj, name) => {
    obj[name] = baseFolder + componentsFolder + name + "/main.js";
    return obj;
  }, {})
};

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

let buildFormats = [];

if (!argv.format || argv.format === "es") {
  const esConfig = {
    input: entriespath,
    external,
    output: {
      format: "esm",
      dir: "dist/esm"
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [["@babel/preset-env", { modules: false }]]
      }),
      commonjs(),
    ]
  };

  const merged = {
    input: "main.js",
    external,
    output: {
      format: "esm",
      file: "dist/tu-header.esm.js"
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel({
        ...baseConfig.plugins.babel,
        presets: [["@babel/preset-env", { modules: false }]]
      }),
      commonjs(),
    ]
  };
  const ind = [
    ...components.map(f => mapComponent(f)).reduce((r, a) => r.concat(a), [])
  ];
  buildFormats.push(esConfig);
  buildFormats.push(merged);
  buildFormats = [...buildFormats, ...ind];
}

if (!argv.format || argv.format === "iife") {
  const unpkgConfig = {
    ...baseConfig,
    input: "main.js",
    external,
    output: {
      compact: true,
      file: "dist/tu-header-browser.min.js",
      format: "iife",
      name: "tuheader",
      exports: "named",
      globals
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      commonjs(),
      terser({
        output: {
          ecma: 5
        }
      })
    ]
  };
  buildFormats.push(unpkgConfig);
}

if (!argv.format || argv.format === "cjs") {
  const cjsConfig = {
    ...baseConfig,
    input: entriespath,
    external,
    output: {
      compact: true,
      format: "cjs",
      dir: "dist/cjs",
      exports: "named",
      globals
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      ...baseConfig.plugins.preVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template,
          optimizeSSR: true
        }
      }),
      ...baseConfig.plugins.postVue,
      babel(baseConfig.plugins.babel),
      commonjs(),
    ]
  };
  buildFormats.push(cjsConfig);
}
// Export config
export default buildFormats;