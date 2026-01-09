import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

const isProduction = process.env.NODE_ENV === 'production';
const shouldStripLogs = process.env.STRIP_LOGS === 'true';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto',
      sourcemap: !isProduction,
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: !isProduction,
    },
  ],
  external: [
    '@qwickapps/logging',
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.STRIP_LOGS': JSON.stringify(shouldStripLogs ? 'true' : 'false'),
      preventAssignment: true,
    }),
    resolve({
      preferBuiltins: true, // Prefer Node.js built-ins for backend
      browser: false,       // This is a backend package
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      sourceMap: !isProduction,
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ],
};