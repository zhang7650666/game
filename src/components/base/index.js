const path = require('path')
const files = require.context('@/components/base', false, /\.vue$/)
const baseCom = {}
files.keys().forEach(key => {
  const name = path.basename(key, '.vue')
  baseCom[name] = files(key).default || files(key)
})

export default baseCom
