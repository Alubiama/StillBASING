import { PAYMASTER_CONFIG } from '../config/paymaster'

/**
 * Get Paymaster configuration for sponsored transactions
 * Returns null if paymaster is not configured
 */
export function getPaymasterConfig() {
  const apiKey = import.meta.env.VITE_CDP_API_KEY

  if (!apiKey || !PAYMASTER_CONFIG.enabled) {
    return null
  }

  return {
    paymasterUrl: PAYMASTER_CONFIG.paymasterUrl,
    apiKey: apiKey,
  }
}

/**
 * Check if paymaster is enabled and configured
 */
export function isPaymasterEnabled() {
  const apiKey = import.meta.env.VITE_CDP_API_KEY
  return PAYMASTER_CONFIG.enabled && !!apiKey
}

/**
 * Get paymaster and data for sponsored transactions
 * This allows users to perform transactions without paying gas fees
 */
export async function getPaymasterData(userOperation) {
  const config = getPaymasterConfig()

  if (!config) {
    console.info('ℹ️ Paymaster not configured. Transaction will require gas fees.')
    return null
  }

  try {
    // For Base Mini Apps, we use Coinbase Paymaster
    // The paymaster sponsors the gas fees for users
    const response = await fetch(config.paymasterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
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
      console.error('Make sure your API key is valid and has paymaster permissions')
      return null
    }

    console.log('✅ Paymaster data received - transaction will be gasless')
    return data.result
  } catch (error) {
    console.error('Failed to get paymaster data:', error)
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
    console.log('To enable gasless transactions:')
    console.log('1. Get API key from https://portal.cdp.coinbase.com/')
    console.log('2. Add to .env: VITE_CDP_API_KEY=your_key')
    console.log('3. Set enabled: true in src/config/paymaster.js')
    console.log('')
    console.log('See PAYMASTER_API_KEY_GUIDE.md for details')
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}
