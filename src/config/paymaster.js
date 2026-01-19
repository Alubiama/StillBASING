/**
 * Paymaster configuration for Base Mini Apps
 *
 * Using Pimlico for sponsored (gasless) transactions
 *
 * To enable:
 * 1. Go to https://dashboard.pimlico.io/
 * 2. Create account and get API key (FREE tier: 100k operations/month!)
 * 3. Add VITE_PIMLICO_API_KEY to .env file
 * 4. Set enabled: true below
 * 5. Rebuild and enjoy gasless transactions!
 *
 * See PIMLICO_SETUP.md for detailed instructions
 */

export const PAYMASTER_CONFIG = {
  // Pimlico API endpoint for Base Sepolia
  paymasterUrl: 'https://api.pimlico.io/v2/base-sepolia/rpc',

  // Whether paymaster is enabled
  enabled: true, // Pimlico paymaster activated! 🚀

  // Provider name
  provider: 'Pimlico',

  // Instructions
  setupInstructions: `
    To enable gasless transactions with Pimlico:

    1. Visit https://dashboard.pimlico.io/
    2. Create free account (100k ops/month free!)
    3. Get your API key
    4. Create .env file in project root:
       VITE_PIMLICO_API_KEY=your_api_key_here
    5. Set enabled: true in this config
    6. Rebuild: npm run build

    That's it! Your users won't pay gas fees!
  `
}

/**
 * Get paymaster client configuration
 */
export function getPaymasterClient() {
  // Use environment variable or fallback to testnet API key
  // For production mainnet, always use environment variable via GitHub Secrets
  const apiKey = import.meta.env.VITE_PIMLICO_API_KEY || 'pim_EFhBGx6UZDFaivHtSKzkFt'

  if (!PAYMASTER_CONFIG.enabled) {
    console.info('⚠️ Paymaster not enabled. Users will pay gas fees.')
    console.info('📖 See PIMLICO_SETUP.md for setup instructions')
    return null
  }

  return {
    url: `${PAYMASTER_CONFIG.paymasterUrl}?apikey=${apiKey}`,
    provider: PAYMASTER_CONFIG.provider,
  }
}
