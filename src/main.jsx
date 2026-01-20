import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'
import { config } from './wagmi'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'
import App from './App.jsx'
import sdk from '@farcaster/frame-sdk'

const queryClient = new QueryClient()

// Initialize Farcaster SDK and mark app as ready
const initializeFarcasterSDK = async () => {
  try {
    const context = await sdk.context
    console.log('Farcaster context:', context)
    sdk.actions.ready()
  } catch (error) {
    console.log('Not running in Farcaster, skipping SDK initialization')
  }
}

initializeFarcasterSDK()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={baseSepolia}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
