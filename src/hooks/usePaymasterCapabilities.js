import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useCapabilities } from 'wagmi/experimental'

/**
 * Hook to get paymaster capabilities for sponsored transactions
 * Uses Wagmi experimental hooks to enable gasless transactions on Base
 *
 * For Base Mini Apps Featured requirements
 */
export function usePaymasterCapabilities() {
  const { address, chainId } = useAccount()

  const { data: availableCapabilities } = useCapabilities({
    account: address,
    query: {
      enabled: !!address,
    },
  })

  const capabilities = useMemo(() => {
    if (!availableCapabilities || !chainId) {
      return {}
    }

    const capabilitiesForChain = availableCapabilities[chainId]

    if (!capabilitiesForChain) {
      return {}
    }

    // Check if paymaster service is supported
    if (capabilitiesForChain['paymasterService']?.supported) {
      // Use environment variable or Coinbase's public paymaster
      const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL || 'https://api.developer.coinbase.com/rpc/v1/base-sepolia'

      return {
        paymasterService: {
          url: paymasterUrl,
        },
      }
    }

    return {}
  }, [availableCapabilities, chainId])

  const isPaymasterSupported = useMemo(() => {
    if (!availableCapabilities || !chainId) return false
    const capabilitiesForChain = availableCapabilities[chainId]
    return capabilitiesForChain?.['paymasterService']?.supported || false
  }, [availableCapabilities, chainId])

  return {
    capabilities,
    isPaymasterSupported,
  }
}
