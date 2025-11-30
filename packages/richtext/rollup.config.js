import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    onwarn(warning, warn) {
      // 忽略 'use client' 指令警告（来自 MUI 库）
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      // 使用默认警告处理其他警告
      warn(warning);
    },
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.test.tsx'],
      }),
    ],
    external: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-quill',
      'react-easy-crop',
      'quill-emoji',
      '@emotion/react',
      '@emotion/styled',
      /\.css$/,
    ],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-quill',
      'react-easy-crop',
      'quill-emoji',
      '@emotion/react',
      '@emotion/styled',
      /\.css$/,
    ],
  },
];

