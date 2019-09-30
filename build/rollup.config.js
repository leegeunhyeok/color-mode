import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/entry.js',
  output: {
    name: 'ColorMode',
    exports: 'named'
  },
  plugins: [
    commonjs(),
    buble(),
    terser({
      include: [/^.+\.min\.js$/, '*esm*'],
      output: {
        comments(_node, comment) {
          var text = comment.value;
          var type = comment.type;
          console.log(type, text)
          if (type === 'comment1') {
            return /@author|@license/i.test(text);
          }
        }
      }
    })
  ]
}