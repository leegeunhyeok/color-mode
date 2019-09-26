import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

export default {
  input: 'src/entry.js',
  output: {
    name: 'ColorMode',
    exports: 'named'
  },
  plugins: [
    commonjs(),
    buble()
  ]
}
