const { readdirSync, statSync, writeFileSync } = require('fs')
const { join } = require('path')

const dirs = path => readdirSync(path).filter(child => statSync(join(path, child)).isDirectory())

const basePath = './src/components/resolvers'
dirs(basePath).forEach(networkName => {
  const networkPath = `${basePath}/${networkName}`
  writeFileSync(`${networkPath}/index.js`, `export default ${JSON.stringify(dirs(networkPath))}\n`)
})
