/**
 * Paymaster configuration for Base Mini Apps
 *
 * To enable sponsored transactions:
 * 1. Go to https://portal.cdp.coinbase.com/
 * 2. Create a project and get your API key
 * 3. Add the API key to your environment variables
 * 4. Configure the paymaster in your wagmi setup
 *
 * For now, transactions will use user's gas fees
 * For production, you need to:
 * - Get Coinbase Developer Platform API key
 * - Configure paymaster endpoint
 * - Add VITE_CDP_API_KEY to .env file
 */

export const PAYMASTER_CONFIG = {
  // Base Sepolia Paymaster endpoint (requires CDP API key)
  paymasterUrl: 'https://api.developer.coinbase.com/rpc/v1/base-sepolia',

  // Whether paymaster is enabled (set to false if no API key)
  enabled: false, // Set to true after getting CDP API key

  // Instructions for setup
  setupInstructions: `
    To enable sponsored (gasless) transactions:

    1. Visit https://portal.cdp.coinbase.com/
    2. Create a new project
    3. Get your API key from the project settings
    4. Create .env file in project root with:
       VITE_CDP_API_KEY=your_api_key_here
    5. Set enabled: true in this config
    6. Rebuild the project

    Users will then enjoy gasless transactions!
  `
}

/**
 * Get paymaster client configuration
 */
export function getPaymasterClient() {
  const apiKey = import.meta.env.VITE_CDP_API_KEY

  if (!apiKey || !PAYMASTER_CONFIG.enabled) {
    console.info('Paymaster not configured. Users will pay gas fees.')
    console.info(PAYMASTER_CONFIG.setupInstructions)
    return null
  }

  return {
    url: PAYMASTER_CONFIG.paymasterUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  }
}
