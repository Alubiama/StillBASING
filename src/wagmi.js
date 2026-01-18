import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Still Basing',
  projectId: 'd8132b158c50aa2101e4349867e01417',
  chains: [baseSepolia, base],
  ssr: false,
})
