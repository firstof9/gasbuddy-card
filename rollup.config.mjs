import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/gasbuddy-card.ts',
  output: {
    file: 'gasbuddy-card.js',
    format: 'es',
    sourcemap: dev,
  },
  plugins: [
    resolve(),
    esbuild({
      tsconfig: './tsconfig.json',
      target: 'es2022',
    }),
    !dev && terser({ format: { comments: false } }),
    {
      name: 'patch-lit-html',
      renderChunk(code) {
        return {
          code: code.replace(/\/-->\/g/g, '/--!?>/g'),
          map: null,
        };
      },
    },
  ].filter(Boolean),
};
