import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { WagmiConfig, configureChains, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { Buffer } from 'buffer'

import { App } from './App'
import reportWebVitals from './reportWebVitals'

// polyfill Buffer for client
if (!window.Buffer) {
  window.Buffer = Buffer
}

const { chains, provider, webSocketProvider } = configureChains(
  [
    {
      name: 'boson',
      rpcUrls: {
        default:
          'https://geth.bsn-development-potassium.bosonportal.io/ac012be65837ebc3134e/rpc',
      },
      network: 'boson',
      id: 1234,
      ensAddress: '0x7208c5FdF31FCc73CeeeF783F6b160eC1a5F18c3',
    },
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default }),
    }),
  ],
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
)

reportWebVitals()
