import { PAYMASTER_CONFIG } from '../config/paymaster'

/**
 * Get Paymaster configuration for sponsored transactions
 * Returns null if paymaster is not configured
 */
export function getPaymasterConfig() {
  // Use environment variable or fallback to testnet API key
  const apiKey = import.meta.env.VITE_PIMLICO_API_KEY || 'pim_EFhBGx6UZDFaivHtSKzkFt'

  if (!PAYMASTER_CONFIG.enabled) {
    return null
  }

  return {
    paymasterUrl: `${PAYMASTER_CONFIG.paymasterUrl}?apikey=${apiKey}`,
    apiKey: apiKey,
    provider: PAYMASTER_CONFIG.provider,
  }
}

/**
 * Check if paymaster is enabled and configured
 */
export function isPaymasterEnabled() {
  const apiKey = import.meta.env.VITE_PIMLICO_API_KEY || 'pim_EFhBGx6UZDFaivHtSKzkFt'
  return PAYMASTER_CONFIG.enabled && !!apiKey
}

/**
 * Get paymaster and data for sponsored transactions
 * This allows users to perform transactions without paying gas fees
 * Using Pimlico paymaster service
 */
export async function getPaymasterData(userOperation) {
  const config = getPaymasterConfig()

  if (!config) {
    console.info('ℹ️ Paymaster not configured. Transaction will require gas fees.')
    return null
  }

  try {
    // Using Pimlico paymaster for Base Sepolia
    // Pimlico sponsors the gas fees for users (100k ops/month free!)
    const response = await fetch(config.paymasterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'pm_sponsorUserOperation',
        params: [
          userOperation,
          {
            entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // EntryPoint v0.6
          }
        ],
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('❌ Pimlico Paymaster error:', data.error)
      console.error('💡 Check your API key and configuration')
      return null
    }

    console.log('✅ Pimlico paymaster active - transaction will be gasless!')
    return data.result
  } catch (error) {
    console.error('❌ Failed to get paymaster data:', error)
    return null
  }
}

/**
 * Get user-friendly message about paymaster status
 */
export function getPaymasterStatus() {
  if (isPaymasterEnabled()) {
    return {
      enabled: true,
      message: '✅ Gasless transactions enabled',
      details: 'All transactions are sponsored - no gas fees for users',
    }
  }

  return {
    enabled: false,
    message: '⚠️ Paymaster not configured',
    details: 'Users will need to pay gas fees. See PAYMASTER_API_KEY_GUIDE.md',
  }
}

/**
 * Log paymaster status on app init
 */
export function logPaymasterStatus() {
  const status = getPaymasterStatus()

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎮 Still Basing - Paymaster Status')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(status.message)
  console.log(status.details)

  if (!status.enabled) {
    console.log('')
    console.log('💡 To enable gasless transactions with Pimlico:')
    console.log('1. Register at https://dashboard.pimlico.io/ (FREE!)')
    console.log('2. Get API key (100k operations/month free)')
    console.log('3. Add to .env: VITE_PIMLICO_API_KEY=your_key')
    console.log('4. Set enabled: true in src/config/paymaster.js')
    console.log('')
    console.log('📖 See PIMLICO_SETUP.md for detailed instructions')
  } else {
    console.log('🚀 Powered by Pimlico - 100k free operations/month')
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}
