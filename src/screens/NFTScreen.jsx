import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../contracts/addresses'
import { BasingCounterABI } from '../contracts/BasingCounterABI'
import { BasingNFTABI } from '../contracts/BasingNFTABI'

const MILESTONES = [
  { clicks: 10, name: 'First Steps', description: 'Completed 10 clicks', emoji: '👣' },
  { clicks: 50, name: 'Getting Started', description: 'Completed 50 clicks', emoji: '🔥' },
  { clicks: 100, name: 'Century Club', description: 'Completed 100 clicks', emoji: '💯' },
  { clicks: 500, name: 'Power User', description: 'Completed 500 clicks', emoji: '⚡' },
  { clicks: 1000, name: 'Legendary', description: 'Completed 1000 clicks', emoji: '👑' },
]

export default function NFTScreen() {
  const { address, isConnected, chainId } = useAccount()

  // Read user clicks
  const { data: userClicks } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getUserClicks',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Read user achievements
  const { data: userAchievements } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getUserAchievements',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Check which NFTs have been claimed
  const { data: hasNFT10 } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingNFT : undefined,
    abi: BasingNFTABI,
    functionName: 'hasClaimedAchievement',
    args: address ? [address, 10] : undefined,
    enabled: !!address && chainId === 84532,
  })

  const { data: hasNFT50 } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingNFT : undefined,
    abi: BasingNFTABI,
    functionName: 'hasClaimedAchievement',
    args: address ? [address, 50] : undefined,
    enabled: !!address && chainId === 84532,
  })

  const { data: hasNFT100 } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingNFT : undefined,
    abi: BasingNFTABI,
    functionName: 'hasClaimedAchievement',
    args: address ? [address, 100] : undefined,
    enabled: !!address && chainId === 84532,
  })

  const { data: hasNFT500 } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingNFT : undefined,
    abi: BasingNFTABI,
    functionName: 'hasClaimedAchievement',
    args: address ? [address, 500] : undefined,
    enabled: !!address && chainId === 84532,
  })

  const { data: hasNFT1000 } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingNFT : undefined,
    abi: BasingNFTABI,
    functionName: 'hasClaimedAchievement',
    args: address ? [address, 1000] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Claim NFT
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const claimedNFTs = {
    10: hasNFT10,
    50: hasNFT50,
    100: hasNFT100,
    500: hasNFT500,
    1000: hasNFT1000,
  }

  const handleClaimNFT = (milestone) => {
    if (!isConnected || chainId !== 84532) return

    writeContract({
      address: CONTRACTS.baseSepolia.BasingNFT,
      abi: BasingNFTABI,
    functionName: 'claimNFT',
      args: [milestone],
    })
  }

  if (!isConnected) {
    return (
      <div className="screen-container">
        <div className="empty-state">
          <span className="empty-icon">🔌</span>
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to view and claim NFTs</p>
        </div>
      </div>
    )
  }

  if (chainId !== 84532) {
    return (
      <div className="screen-container">
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <h2>Wrong Network</h2>
          <p>Please switch to Base Sepolia testnet</p>
        </div>
      </div>
    )
  }

  const clicks = userClicks ? Number(userClicks) : 0
  const achievements = userAchievements || []

  return (
    <div className="screen-container nft-screen">
      <div className="nft-content">
        <h1 className="screen-title">Achievement NFTs</h1>
        <p className="screen-subtitle">Claim unique NFTs for each milestone you reach</p>

        {isPending && (
          <div className="status-message">
            <span className="loading-spinner"></span>
            Waiting for approval...
          </div>
        )}
        {isConfirming && (
          <div className="status-message">
            <span className="loading-spinner"></span>
            Minting NFT...
          </div>
        )}
        {isConfirmed && (
          <div className="status-message success">
            NFT claimed successfully! ✓
          </div>
        )}

        <div className="nft-grid">
          {MILESTONES.map((milestone) => {
            const isUnlocked = achievements.some(a => Number(a) === milestone.clicks)
            const isClaimed = claimedNFTs[milestone.clicks]
            const canClaim = isUnlocked && !isClaimed

            return (
              <div
                key={milestone.clicks}
                className={`nft-card ${isUnlocked ? 'unlocked' : 'locked'} ${isClaimed ? 'claimed' : ''}`}
              >
                <div className="nft-image">
                  <span className="nft-emoji">{milestone.emoji}</span>
                  {!isUnlocked && <div className="nft-lock">🔒</div>}
                  {isClaimed && <div className="nft-badge">Claimed</div>}
                </div>

                <div className="nft-info">
                  <h3 className="nft-title">{milestone.name}</h3>
                  <p className="nft-description">{milestone.description}</p>

                  <div className="nft-requirement">
                    {milestone.clicks} clicks required
                  </div>

                  {!isUnlocked && (
                    <div className="nft-progress">
                      <div className="nft-progress-bar">
                        <div
                          className="nft-progress-fill"
                          style={{ width: `${Math.min((clicks / milestone.clicks) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="nft-progress-text">{clicks} / {milestone.clicks}</span>
                    </div>
                  )}

                  {canClaim && (
                    <button
                      className="claim-button"
                      onClick={() => handleClaimNFT(milestone.clicks)}
                      disabled={isPending || isConfirming}
                    >
                      Claim NFT
                    </button>
                  )}

                  {isClaimed && (
                    <button className="claim-button claimed" disabled>
                      ✓ Claimed
                    </button>
                  )}

                  {!isUnlocked && (
                    <button className="claim-button locked" disabled>
                      🔒 Locked
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
