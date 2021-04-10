import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';
import scss from 'rollup-plugin-scss';
import svg from 'rollup-plugin-svg';
import html from 'rollup-plugin-html';

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  html({
    include: '**/*.html',
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'production'
    ),
  }),
  resolve({
    browser: true,
  }),
  typescript(),
  commonjs(),
  json({
    preferConst: true,
  }),
  scss({
    output: false,
  }),
  svg(),
];

const onwarn = (warning, next) => {
  if (warning.loc && warning.loc.file.includes('/node_modules/')) {
    return;
  }
  next(warning);
};

const files = ['background/index', 'toster'];

if (!isProduction) {
  files.push('hot-reload');
}

export default [
  ...files.map((file) => ({
    input: `./src/${file}.ts`,
    onwarn,
    output: {
      file: `./extension/${file.replace('/index', '')}.js`,
      format: 'esm',
    },
    plugins: [
      ...plugins,
    ],
  })),
  {
    input: 'src/options/index.ts',
    onwarn,
    output: {
      file: 'extension/options.js',
      format: 'esm',
    },
    plugins: [...plugins, vue()],
  },
];
