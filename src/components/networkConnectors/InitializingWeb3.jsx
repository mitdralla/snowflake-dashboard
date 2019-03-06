import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import WalletConnectQRCodeModal from 'walletconnect-qrcode-modal'

import Web3Error from './Web3Error'
import Loader from './Loader'
import { Connectors, useWeb3Context } from 'web3-react'
import Common, { Button, ButtonLink, Text, Link } from './common'

import metamaskLogo from './assets/metamask.svg'
// import infuraLogo from './assets/infura.svg'
import walletConnectLogo from './assets/walletConnect.svg'

const { MetaMaskConnector, WalletConnectConnector } = Connectors;
const greyTextColor = '#a3a5a8'
const mobilePixelCutoff = '600px'

const Container = styled.div`
  margin: 2em;

  @media (max-width: ${mobilePixelCutoff}) {
    width: 95%;
  }

  @media (max-width: 1000px) {
    width: 75%;
  }

  @media (min-width: 1000px) {
    width: 75%;
  }

  @media (min-width: 1200px) {
    width: 50%;
  }
`

const ConnectorWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  width: 100%;
  border-radius: 1em;
  margin-bottom: 2em;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${mobilePixelCutoff}) {
    flex-direction: column;
  }
`

const ConnectorSection: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: any) => props.justifyContent};
  flex-basis: ${(props: any) => props.percent};

  @media (max-width: ${mobilePixelCutoff}) {
    justify-content: center;
  }
`

const ConnectorButton = styled(Button)`
  margin-right: 1em;
  padding-left: 1.5em;
  padding-right: 1.5em;

  @media (max-width: ${mobilePixelCutoff}) {
    margin-right: 0em;
    margin-bottom: 1em;
  }
`

const ConnectorButtonLink = styled(ButtonLink)`
  margin-right: 1em;
  padding-left: 1.5em;
  padding-right: 1.5em;

  @media (max-width: ${mobilePixelCutoff}) {
    margin-right: 0em;
    margin-bottom: 1em;
  }
`

const ExplanatoryText = styled(Text)`
  margin-right: 1em;
  font-size: .9em;
  font-weight: 500;
  color: ${greyTextColor}

  @media (max-width: ${mobilePixelCutoff}) {
    margin-top: 0;
    margin-right: 0;
    text-align: center;
  }
`

const Logo = styled.div`
  margin: 1em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 4em;
  min-width: 4em;
`

const MetamaskLogo = styled(Logo)`
  background-image: url(${metamaskLogo});
`

const WalletConnectLogo = styled(Logo)`
  background-image: url(${walletConnectLogo});
`

function getDetails(connector: Connector) {
  if (connector instanceof MetaMaskConnector)
    return {
      logo: <MetamaskLogo />,
      text: (
        <>
          Connect to{' '}
          <Link href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>MetaMask</Link>
          .
        </>
      ),
      buttonText: 'Connect to MetaMask'
    }

  if (!(connector instanceof WalletConnectConnector))
    throw Error('Unsupported connector.')

  return {
    logo: <WalletConnectLogo />,
    text: (
      <>
        Use{' '}
        <Link href='https://walletconnect.org/' target='_blank' rel='noopener noreferrer'>WalletConnect</Link>
        .
      </>
    ),
    buttonText: 'Use WalletConnect'
  }
}

export default function InitializingWeb3 ({ children, connectors }) {
  const context = useWeb3Context()
  const [initializationOver, setInitializationOver] = useState(false)

  useEffect(() => {
    context.setConnector('metamask', true)
      .catch(() => {
        setInitializationOver(true)
        console.log('Unable to automatically activate MetaMask') // eslint-disable-line no-console
      })
  }, [])

  const walletConnectCalled = useRef(false)
  const activeTimeouts = useRef([])

  useEffect(() => () => activeTimeouts.current.forEach(t => window.clearTimeout(t)), [])

  useEffect(() => {
    if (context.active)
      try {
        WalletConnectQRCodeModal.close()
      } catch {
        return
      }
    }, [context.active])

  useEffect(() => {
    const cleanup: Array<Function> = []
    for (const connector of Object.keys(connectors).map(k => connectors[k])) {
      if (connector instanceof MetaMaskConnector) {
        connector.on('Activated', ActivatedHandler)
        cleanup.push(() => connector.removeListener('Activated', ActivatedHandler))
      }
      else if (connector instanceof WalletConnectConnector) {
        connector.on('URIAvailable', (URI: string) => URIAvailableHandler(connector, URI))
        cleanup.push(() => connector.removeListener('URIAvailable', URIAvailableHandler))
      }
    }
    if (cleanup.length > 0) return () => cleanup.forEach(c => c())
  }, [])

  const [showLoader, setShowLoader] = useState(false)

  function ActivatedHandler () {
    activeTimeouts.current = activeTimeouts.current.slice().concat([window.setTimeout(() => setShowLoader(true), 150)])
  }

  function URIAvailableHandler (connector: Connector, URI: string) {
    if (connector.isConnected)
      activeTimeouts.current = activeTimeouts.current.slice().concat([window.setTimeout(() => setShowLoader(true), 150)])
    else
      WalletConnectQRCodeModal.open(URI)
  }

  function handleClick (connectorName: string) {
    if (connectors[connectorName] instanceof WalletConnectConnector && walletConnectCalled.current) {
      WalletConnectQRCodeModal.open(connectors[connectorName].uri)
    } else if (connectors[connectorName] instanceof WalletConnectConnector && !walletConnectCalled.current) {
      walletConnectCalled.current = true
      context.setConnector(connectorName, false)
    } else {
      context.setConnector(connectorName, false)
    }
  }

  function unsetConnectorWrapper () {
    setShowLoader(false)
    context.unsetConnector()
  }

  if (!initializationOver && !context.active) return null

  if (context.error) return <Web3Error error={context.error} connectors={connectors} connectorName={context.connectorName} unsetConnector={unsetConnectorWrapper} />

  if (context.active) return children

  return showLoader ? <Loader /> :
    <Common>
      <Container>
        {Object.keys(connectors).map(c => {
          const connectorDetails = getDetails(connectors[c])
          return (
            <ConnectorWrapper key={c}>
              <ConnectorSection percent='20%'>
                {connectorDetails.logo}
              </ConnectorSection>
              <ConnectorSection percent='40%' justifyContent='flex-start'>
                <ExplanatoryText>
                  {connectorDetails.text}
                </ExplanatoryText>
              </ConnectorSection>
              <ConnectorSection percent='40%' justifyContent='flex-end'>
                {connectors[c].redirectTo ?
                  <ConnectorButtonLink href={connectors[c].redirectTo} target='_blank' rel='noopener noreferrer'>
                    {connectorDetails.buttonText}
                  </ConnectorButtonLink>
                  :
                  <ConnectorButton onClick={() => handleClick(c)}>{connectorDetails.buttonText}</ConnectorButton>
                }
              </ConnectorSection>
            </ConnectorWrapper>
          )
        })}
      </Container>
    </Common>
}
