/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  // console.log(key.replace(/(\.\/|\.js)/g, ''))
  // console.log(files(key).default)
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules