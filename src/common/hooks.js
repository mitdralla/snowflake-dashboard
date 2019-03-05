import { useState, useEffect, useMemo, useRef } from 'react'
import { useWeb3Context, useNetworkName, useERC20Balance, useAccountEffect } from 'web3-react/hooks'
import { toDecimal } from 'web3-react/utilities'

import contracts from './contracts'
import { GENERIC_SNOWFLAKE_RESOLVER_ABI } from './utilities'
import { default as defaultLogo } from '../components/resolvers/defaultLogo.png'


// Gets selected contract data.
export function useNamedContract(name) {
  const networkName = useNetworkName()
  const contractVariables = contracts[networkName][name]
  return useGenericContract(contractVariables.address, contractVariables.ABI)
}

export function useGenericContract(address, ABI) {
  const context = useWeb3Context()
  return useMemo(() => new context.library.eth.Contract(ABI, address), [address, ABI])
}

// Gets the users EIN.
export function useEIN (address) {
  const context = useWeb3Context()
  const _1484Contract = useNamedContract('1484')
  const [ein, setEIN] = useState()

  useAccountEffect(() => {
    _1484Contract.methods.getEIN(address || context.account).call()
      .then(result => {
        if (result === '3963877391197344453575983046348115674221700746820753546331534351508065746944')
          throw Error('web3js bug')
        setEIN(result)
      })
      .catch(() => setEIN(null))
  })

  return ein
}

// Gets the users HydroId.
export function useHydroId () {
  const clientRaindropContract = useNamedContract('clientRaindrop')
  const ein = useEIN()
  const [hydroId, setHydroId] = useState({hydroId: undefined, hydroIdAddress: undefined})

  useAccountEffect(() => {
    if (ein) {
      clientRaindropContract.methods["getDetails(uint256)"](ein).call()
        .then(result => setHydroId({hydroId: result.casedHydroID, hydroIdAddress: result._address}))
        .catch(() => setHydroId(null))
    }
  }, [ein])

  if (ein === null)
    return [null, null]
  else
    return hydroId === null ? [null, null] : [hydroId.hydroId, hydroId.hydroIdAddress]
}

// Use the users Hydro balance.
export function useHydroBalance () {
  const context = useWeb3Context()
  const networkName = useNetworkName()

  return useERC20Balance(contracts[networkName].token.address, context.account)
}

// Use the users Snowflake balance.
export function useSnowflakeBalance (ein, unconverted = false) {
  const snowflakeContract = useNamedContract('snowflake')
  const [snowflakeBalance, setSnowflakeBalance] = useState()

  useAccountEffect(() => {
    if (ein) {
      snowflakeContract.methods.deposits(ein).call()
        .then(balance => {
          setSnowflakeBalance(unconverted ? balance : Number(toDecimal(balance, 18)).toLocaleString(undefined, { maximumFractionDigits: 3 }))
        })
    }
  }, [ein])

  return ein === null ? "0" : snowflakeBalance
}

// Use get the identity of the selected Snowflke user and set their details.
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

// The resolver (dApp) has an allowance of Hydro it can use. The allowance gets set here.
export function useResolverAllowances (resolvers = []) {
  const ein = useEIN()
  const snowflakeContract = useNamedContract('snowflake')
  const [allowances, setAllowances] = useState()

  useAccountEffect(() => {
    if (ein && resolvers.length > 0) {
      Promise.all(resolvers.map(resolver =>
        snowflakeContract.methods.resolverAllowances(ein, resolver).call()
          .then(allowance => toDecimal(allowance, 18))
      ))
        .then(results => setAllowances(results))
    }
  }, [ein, JSON.stringify(resolvers)])

  return ein === null ? null : allowances
}

// Gets the details of the resolver (dApp) - Properties like its name and description are defined here.
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

  // Look for the resolvers (dApps) in the 'resolvers/{network_name}' folder and import their details. Network names are Rinkeby and Mainnet.
  // Resolver properties will most likely be added on to here.
  const resolverPath = `components/resolvers/${networkName}/${resolver}`
  const localDetails = await import('../' + resolverPath)
    .then(details => ({
      component:          details.default,
      logo:               details.logo || defaultLogo,
      requiredAllowance:  details.requiredAllowance || 0,
      extraDataComponent: details.extraDataComponent || null,
    }))
    .catch(() => ({
      component:         null,
      logo:              null,
      requiredAllowance: null,
      extraDataComponent:    null
    }))

  return {...chainDetails, ...localDetails}
}

// Get the seleced resolvers (dApps) details.
export function useResolverDetails (resolvers = []) {
  const context = useWeb3Context()
  const networkName = useNetworkName()
  const snowflakeContract = useNamedContract('snowflake')
  const [resolverDetails, setResolverDetails] = useState()

  useAccountEffect(() => {
    if (resolvers.length > 0)
      Promise.all(resolvers.map(resolver =>
        getResolverDetails(context.library, snowflakeContract, networkName, resolver)
      ))
        .then(results => setResolverDetails(results))
  }, [JSON.stringify(resolvers)])

  return resolverDetails
}

// Not entirely sure what this is doing, but a debounce limits the amount of times a function can fire.
export function useDebounce (value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function useSessionStorageState(defaultValue, key) {
  const firstRender = useRef(true)

  useEffect(() => {
    firstRender.current = false
  }, [])

  let initialSessionStorageState = defaultValue
  if (firstRender.current) {
    const potentialSessionStorageState = sessionStorage.getItem(key)
    if (potentialSessionStorageState) initialSessionStorageState = JSON.parse(potentialSessionStorageState)
  }

  const [sessionStorageState, setSessionStorageState] = useState(initialSessionStorageState)

  function setSessionStorageStateWrapper (newSessionStorageState) {
    sessionStorage.setItem(key, JSON.stringify(newSessionStorageState))
    setSessionStorageState(newSessionStorageState)
  }

  function removeSessionStorageState () {
    sessionStorage.removeItem(key)
    setSessionStorageState(defaultValue)
  }

  return [sessionStorageState, setSessionStorageStateWrapper, removeSessionStorageState]
}
