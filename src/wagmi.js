import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Still Basing',
  projectId: 'YOUR_PROJECT_ID', // Получите бесплатно на walletconnect.com
  chains: [baseSepolia, base],
  ssr: false,
})
