import { useState, useEffect, useReducer, useMemo, useRef } from 'react'
import { useWeb3Context } from 'web3-react'
import { isValidWeb3ContextInterface } from 'web3-react/dist/types'
import contracts from './contracts'
import {
  GENERIC_SNOWFLAKE_RESOLVER_ABI,
  TRANSACTION_ERROR_CODES,
  getNetworkName,
  getAccountBalance,
  getEtherscanLink,
  getERC20Balance,
  signPersonal,
  sendTransaction,
  toDecimal
} from './utilities';

import { default as defaultLogo } from 'resolvers/defaultLogo.png'

export function useNetworkName (networkId) {
  const context = useWeb3Context()
  return useMemo(() => getNetworkName(networkId || context.networkId), [networkId, context.networkId])
}

export function useAccountEffect(effect, depends = []) {
  const context = useWeb3Context()
  useEffect(effect, [...depends, context.networkId, context.account, context.reRenderers.accountReRenderer])
}

export function useAccountBalance (address, {numberOfDigits = 3, format} = {}) {
  const context = useWeb3Context()
  const [ balance, setBalance ] = useState(undefined)

  useAccountEffect(() => {
    getAccountBalance(context.library, address || context.account, format)
      .then(balance =>
        setBalance(Number(balance).toLocaleString(undefined, { maximumFractionDigits: numberOfDigits }))
      )
  })

  return balance
}

export function useEtherscanLink (type, data, networkId) {
  const context = useWeb3Context()
  return useMemo(
    () => getEtherscanLink(networkId || context.networkId, type, data), [networkId, context.networkId, type, data]
  )
}

export function useERC20Balance (ERC20Address, address, numberOfDigits = 3) {
  const context = useWeb3Context()
  const [ ERC20Balance, setERC20Balance ] = useState(undefined)

  useAccountEffect(() => {
    if (isValidWeb3ContextInterface(context)) {
      const addressToCheck = address ? address : context.account
      if (addressToCheck === null) throw Error('tests')
      getERC20Balance(context.library, ERC20Address, context.account || address)
        .then((balance) =>
          setERC20Balance(Number(balance).toLocaleString(undefined, { maximumFractionDigits: numberOfDigits }))
        )
    }
  })

  return ERC20Balance
}

const initialSignature = {
  state: 'ready',
  data: {
    signature:      undefined,
    signatureError: undefined
  }
}

function signatureReducer (state, action) {
  switch (action.type) {
    case 'READY':
      return initialSignature
    case 'PENDING':
      return { state: 'pending', data: initialSignature.data }
    case 'SUCCESS':
      return { state: 'success', data: { ...state.data, ...action.data } }
    case 'ERROR':
      return { state: 'error',   data: { ...state.data, ...action.data } }
    default:
      throw Error('No default case.')
  }
}

export function useSignPersonalManager (message, { handlers = {} } = {}) {
  const context = useWeb3Context()

  const [signature, dispatch] = useReducer(signatureReducer, initialSignature)

  function _signPersonal () {
    if (!isValidWeb3ContextInterface(context))
      throw Error('No library in context. Ensure your connector is configured correctly.')

    if (context.account === null)
      throw Error('No account in context. Ensure your connector is configured correctly.')

    dispatch({ type: 'PENDING' })

    signPersonal(context.library, context.account, message)
      .then((signature: any) => {
        dispatch({ type: 'SUCCESS', data: { signature: signature } })
        handlers.success && handlers.success(signature)
      })
      .catch((error: Error) => {
        dispatch({ type: 'ERROR', data: { signatureError: error } })
        handlers.error && handlers.error(error)
      })
  }

  function resetSignature () { dispatch({ type: 'READY' }) }

  return [signature.state, signature.data, _signPersonal, resetSignature]
}

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
  const localDetails = await import(`resolvers/${networkName}/${resolver}`)
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

const initialTransaction = {
  state: 'ready',
  data: {
    transactionHash:          undefined,
    transactionReceipt:       undefined,
    transactionConfirmations: undefined,
    transactionError:         undefined,
    transactionErrorCode:     undefined
  }
}

function transactionReducer (state: any, action: any) {
  switch (action.type) {
    case 'READY':
      return initialTransaction
    case 'SENDING':
      return { state: 'sending', data: initialTransaction.data }
    case 'PENDING':
      return { state: 'pending', data: { ...state.data, ...action.data } }
    case 'SUCCESS':
      return { state: 'success', data: { ...state.data, ...action.data } }
    case 'ERROR':
      return { state: 'error',   data: { ...state.data, ...action.data } }
    default:
      throw Error('No default case.')
  }
}

export function useTransactionManager (method, { handlers = {}, transactionOptions = {}, maximumConfirmations } = {} ) {
  const context = useWeb3Context()

  const [transaction, dispatch] = useReducer(transactionReducer, initialTransaction)

  const wrappedHandlers = {
    transactionHash: (transactionHash: any) => {
      dispatch({ type: 'PENDING', data: { transactionHash: transactionHash } })
      handlers.transactionHash && handlers.transactionHash(transactionHash)
    },
    receipt: (transactionReceipt: any) => {
      dispatch({ type: 'SUCCESS', data: { transactionReceipt: transactionReceipt } })
      handlers.receipt && handlers.receipt(transactionReceipt)
    },
    confirmation: (transactionConfirmations: any, transactionReceipt: any) => {
      if (maximumConfirmations && transactionConfirmations <= maximumConfirmations) {
        dispatch({
          type: 'SUCCESS',
          data: { transactionConfirmations: transactionConfirmations, transactionReceipt: transactionReceipt }
        })
        handlers.confirmation && handlers.confirmation(transactionConfirmations, transactionReceipt)
      }
    }
  }

  function _sendTransaction () {
    if (!isValidWeb3ContextInterface(context))
      throw Error('No library in context. Ensure your connector is configured correctly.')

    if (context.account === null)
      throw Error('No account in context. Ensure your connector is configured correctly.')

    dispatch({ type: 'SENDING' })

    sendTransaction(context.library, context.account, method, wrappedHandlers, transactionOptions)
      .catch((error: any) => {
        const transactionErrorCode = error.code ?
          (TRANSACTION_ERROR_CODES.includes(error.code) ? error.code : undefined) :
          undefined
        dispatch({ type: 'ERROR', data: { transactionError: error, transactionErrorCode: transactionErrorCode } })
        handlers.error && handlers.error(error)
      })
  }

  function resetTransaction () { dispatch({ type: 'READY' }) }

  return [transaction.state, transaction.data, _sendTransaction, resetTransaction, TRANSACTION_ERROR_CODES]
}
