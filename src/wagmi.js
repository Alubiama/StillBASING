import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'Still Basing',
  projectId: 'd8132b158c50aa2101e4349867e01417',
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: 'Still Basing',
      preference: 'smartWalletOnly', // Force Smart Wallet for gasless transactions
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false,
})
