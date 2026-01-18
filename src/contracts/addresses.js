// Deployed contract addresses on Base Sepolia
export const CONTRACTS = {
  baseSepolia: {
    BasingCounter: '0x9a561f3018F454e2D2dBB30a71f8C1Cd3a84404c',
    BasingNFT: '0xAff4b98Ab1fC5Bac2a130751734c02f32c8DD679',
  },
  // For future mainnet deployment
  base: {
    BasingCounter: '',
    BasingNFT: '',
  },
}

// Helper to get contract address for current chain
export const getContractAddress = (chainId, contractName) => {
  if (chainId === 84532) {
    // Base Sepolia
    return CONTRACTS.baseSepolia[contractName]
  } else if (chainId === 8453) {
    // Base Mainnet
    return CONTRACTS.base[contractName]
  }
  throw new Error(`Unsupported chain ID: ${chainId}`)
}
