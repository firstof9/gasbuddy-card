import typescript from '@rollup/plugin-typescript';
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
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: { noEmit: false, declaration: false },
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
