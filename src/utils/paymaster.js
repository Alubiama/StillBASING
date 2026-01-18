import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { baseSepolia } from 'viem/chains'

// Coinbase Paymaster URL for Base Sepolia
const PAYMASTER_URL = 'https://api.developer.coinbase.com/rpc/v1/base-sepolia'

/**
 * Get paymaster and data for sponsored transactions
 * This allows users to perform transactions without paying gas fees
 */
export async function getPaymasterData(userOperation) {
  try {
    // For Base Mini Apps, we use Coinbase Paymaster
    // The paymaster sponsors the gas fees for users
    const response = await fetch(PAYMASTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'pm_getPaymasterData',
        params: [userOperation],
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('Paymaster error:', data.error)
      return null
    }

    return data.result
  } catch (error) {
    console.error('Failed to get paymaster data:', error)
    return null
  }
}

/**
 * Check if paymaster is available
 */
export function isPaymasterAvailable() {
  // Paymaster is available on Base Sepolia testnet
  return true
}
