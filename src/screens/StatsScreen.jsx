import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '../contracts/addresses'
import { BasingCounterABI } from '../contracts/BasingCounterABI'

const MILESTONES = [10, 50, 100, 500, 1000]

export default function StatsScreen() {
  const { address, isConnected, chainId } = useAccount()

  // Read user clicks from contract
  const { data: userClicks } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getUserClicks',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Read total clicks from contract
  const { data: totalClicks } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'totalClicks',
    enabled: chainId === 84532,
  })

  // Read user achievements
  const { data: userAchievements } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getUserAchievements',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Read next milestone
  const { data: nextMilestone } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getNextMilestone',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  if (!isConnected) {
    return (
      <div className="screen-container">
        <div className="empty-state">
          <span className="empty-icon">🔌</span>
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to view your statistics</p>
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
  const total = totalClicks ? Number(totalClicks) : 0
  const achievements = userAchievements || []
  const next = nextMilestone ? Number(nextMilestone) : MILESTONES[0]

  // Calculate progress to next milestone
  const currentMilestoneIndex = MILESTONES.findIndex(m => m === next)
  const previousMilestone = currentMilestoneIndex > 0 ? MILESTONES[currentMilestoneIndex - 1] : 0
  const progressPercent = next > 0 ? ((clicks - previousMilestone) / (next - previousMilestone)) * 100 : 0

  return (
    <div className="screen-container stats-screen">
      <div className="stats-content">
        <h1 className="screen-title">Your Statistics</h1>

        {/* Main Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card large">
            <div className="stat-icon">👆</div>
            <div className="stat-label">Your Clicks</div>
            <div className="stat-value-large">{clicks}</div>
          </div>

          <div className="stat-card large">
            <div className="stat-icon">🌍</div>
            <div className="stat-label">Total Clicks</div>
            <div className="stat-value-large">{total}</div>
          </div>

          <div className="stat-card large">
            <div className="stat-icon">🏆</div>
            <div className="stat-label">Achievements</div>
            <div className="stat-value-large">{achievements.length}/{MILESTONES.length}</div>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {next > clicks && (
          <div className="milestone-progress">
            <div className="progress-header">
              <h3>Next Achievement</h3>
              <span className="progress-text">{clicks} / {next}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
            <p className="progress-subtitle">{next - clicks} clicks remaining</p>
          </div>
        )}

        {/* All Milestones */}
        <div className="milestones-section">
          <h3>All Milestones</h3>
          <div className="milestones-list">
            {MILESTONES.map((milestone, index) => {
              const isUnlocked = achievements.some(a => Number(a) === milestone)
              const isCurrent = milestone === next && clicks < next
              const percentage = clicks >= milestone ? 100 : (clicks / milestone) * 100

              return (
                <div
                  key={milestone}
                  className={`milestone-item ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="milestone-icon">
                    {isUnlocked ? '✅' : isCurrent ? '🎯' : '🔒'}
                  </div>
                  <div className="milestone-info">
                    <div className="milestone-title">
                      {milestone} Clicks
                      {isUnlocked && <span className="badge">Unlocked</span>}
                      {isCurrent && <span className="badge current">In Progress</span>}
                    </div>
                    <div className="milestone-progress-bar">
                      <div
                        className="milestone-progress-fill"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fun Stats */}
        <div className="fun-stats">
          <h3>Fun Facts</h3>
          <div className="fun-stats-grid">
            <div className="fun-stat">
              <span className="fun-stat-icon">📈</span>
              <div className="fun-stat-value">{total > 0 ? ((clicks / total) * 100).toFixed(2) : 0}%</div>
              <div className="fun-stat-label">Your contribution</div>
            </div>
            <div className="fun-stat">
              <span className="fun-stat-icon">🎯</span>
              <div className="fun-stat-value">{clicks > 0 ? ((achievements.length / MILESTONES.length) * 100).toFixed(0) : 0}%</div>
              <div className="fun-stat-label">Completion rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
