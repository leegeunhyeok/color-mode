import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/entry.js',
  output: {
    name: 'ColorMode',
    exports: 'auto'
  },
  plugins: [
    commonjs(),
    buble(),
    terser({
      include: [/^.+\.min\.js$/, '*esm*'],
      output: {
        comments(_node, comment) {
          var text = comment.value
          var type = comment.type
          if (type === 'comment1') {
            return /@license|@version|@author/i.test(text)
          }
        }
      }
    })
  ]
}
