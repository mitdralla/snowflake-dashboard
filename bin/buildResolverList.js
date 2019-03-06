#!/bin/node

const { readdirSync, statSync, writeFileSync } = require('fs')
const { join } = require('path')

const dirs = path => readdirSync(path).filter(child => statSync(join(path, child)).isDirectory())

const basePath = './src/components/resolvers'
const networkNames = dirs(basePath)

// write index.js for each network
networkNames.forEach(networkName => {
  const networkPath = `${basePath}/${networkName}`
  writeFileSync(`${networkPath}/index.js`, `export default ${JSON.stringify(dirs(networkPath))}\n`)
})

// write common index.js for all resolvers from each network
const importStatement = networkNames.map(networkName => `import ${networkName} from './${networkName}'`).join('\n')
const exportStatement = networkNames.map(networkName => `${networkName}: ${networkName}`).join(', ')
writeFileSync(`${basePath}/index.js`, `${importStatement}\n\nexport default { ${exportStatement} }`)
