import { useState } from 'react'
import { useWeb3Context, useNetworkName, useERC20Balance, useAccountEffect } from 'web3-react/hooks'
import { toDecimal } from 'web3-react/utilities'

import contracts from './contracts'
import { GENERIC_SNOWFLAKE_RESOLVER_ABI } from './utilities'
import { default as defaultLogo } from '../components/resolvers/defaultLogo.png'

export function useNamedContract(name) {
  const context = useWeb3Context()
  const networkName = useNetworkName()

  const contractVariables = contracts[networkName][name]

  return new context.web3js.eth.Contract(contractVariables.ABI, contractVariables.address)
}

export function useEIN () {
  const context = useWeb3Context()
  const _1484Contract = useNamedContract('1484')
  const [ein, setEIN] = useState()

  useAccountEffect(() => {
    _1484Contract.methods.getEIN(context.account).call()
      .then(result => {
        if (result === '3963877391197344453575983046348115674221700746820753546331534351508065746944')
          throw Error('web3js bug')
        setEIN(result)
      })
      .catch(() => setEIN(null))
  })

  return ein
}

export function useHydroId () {
  const clientRaindropContract = useNamedContract('clientRaindrop')
  const ein = useEIN()
  const [hydroId, setHydroId] = useState()

  useAccountEffect(() => {
    if (ein) {
      clientRaindropContract.methods.getDetails(ein).call()
        .then(result => setHydroId(result.casedHydroID))
        .catch(() => setHydroId(null))
    }
  }, [ein])

  return ein === null ? null : hydroId
}

export function useHydroBalance () {
  const context = useWeb3Context()
  const networkName = useNetworkName()

  return useERC20Balance(contracts[networkName].token.address, context.account)
}

export function useSnowflakeBalance (ein) {
  const snowflakeContract = useNamedContract('snowflake')
  const [snowflakeBalance, setSnowflakeBalance] = useState()

  useAccountEffect(() => {
    if (ein) {
      snowflakeContract.methods.deposits(ein).call()
        .then(balance => {
          setSnowflakeBalance(Number(toDecimal(balance, 18)).toLocaleString(undefined, { maximumFractionDigits: 3 }))
        })
    }
  }, [ein])

  return ein === null ? "0" : snowflakeBalance
}

export function useEINDetails (ein) {
  const _1484Contract = useNamedContract('1484')
  const [einDetails, setEINDetails] = useState()

  useAccountEffect(() => {
    if (ein) {
      _1484Contract.methods.getIdentity(ein).call()
        .then(details => {
          setEINDetails(details)
        })
    }
  }, [ein])

  return ein === null ? null : einDetails
}

export function useResolverAllowances (resolvers = []) {
  const ein = useEIN()
  const snowflakeContract = useNamedContract('snowflake')
  const [allowances, setAllowances] = useState()

  useAccountEffect(() => {
    if (ein && resolvers.length > 0) {
      Promise.all(resolvers.map(async resolver =>
        snowflakeContract.methods.resolverAllowances(ein, resolver).call()
          .then(allowance => toDecimal(allowance, 18))
      ))
        .then(results => setAllowances(results))
    }
  }, [ein, JSON.stringify(resolvers)])

  return ein === null ? null : allowances
}

async function getResolverDetails(web3js, snowflakeContract, networkName, resolver) {
  const genericContract = new web3js.eth.Contract(GENERIC_SNOWFLAKE_RESOLVER_ABI, resolver)

  const name = () => genericContract.methods.snowflakeName().call()
  const description = () => genericContract.methods.snowflakeDescription().call()

  const chainDetails = await Promise.all([name(), description()])
    .then(([name, description]) => ({
        name:        name,
        description: description
    }))
    .catch(() => ({
      name:        null,
      description: null
    }))

  const resolverPath = `components/resolvers/${networkName}/${resolver}`
  const localDetails = await import('../' + resolverPath)
    .then(details => ({
      component:         details.default,
      logo:              details.logo || defaultLogo,
      requiredAllowance: details.requiredAllowance || 0,
    }))
    .catch(() => ({
      component:         null,
      logo:              null,
      requiredAllowance: null,
    }))

  return {...chainDetails, ...localDetails}
}

export function useResolverDetails (resolvers = []) {
  const context = useWeb3Context()
  const networkName = useNetworkName()
  const snowflakeContract = useNamedContract('snowflake')
  const [resolverDetails, setResolverDetails] = useState()

  useAccountEffect(() => {
    if (resolvers.length > 0)
      Promise.all(resolvers.map(async resolver =>
        getResolverDetails(context.web3js, snowflakeContract, networkName, resolver)
      ))
        .then(results => setResolverDetails(results))
  }, [JSON.stringify(resolvers)])

  return resolverDetails
}
