import { useState, useEffect } from 'react'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from './contracts/addresses'
import { BasingCounterABI } from './contracts/BasingCounterABI'
import PlayScreen from './screens/PlayScreen'
import StatsScreen from './screens/StatsScreen'
import NFTScreen from './screens/NFTScreen'
import './App.css'

export default function App() {
  const { address, isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_completed')
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dark_mode') === 'true' ||
           window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [activeNav, setActiveNav] = useState('play')

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    localStorage.setItem('dark_mode', darkMode)
  }, [darkMode])

  // Auto-connect wallet for Base Mini Apps
  useEffect(() => {
    if (!isConnected && openConnectModal) {
      // Auto-open connect modal after a short delay to avoid blocking initial render
      const timer = setTimeout(() => {
        openConnectModal()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isConnected, openConnectModal])

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

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboarding_completed', 'true')
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  // Render current screen based on navigation
  const renderScreen = () => {
    switch (activeNav) {
      case 'play':
        return <PlayScreen />
      case 'stats':
        return <StatsScreen />
      case 'nft':
        return <NFTScreen />
      default:
        return <PlayScreen />
    }
  }

  return (
    <div className="app">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-modal">
            <h1>Welcome to Still Basing! 🔵</h1>
            <div className="onboarding-content">
              <p className="intro">An interactive on-chain experience on Base blockchain.</p>

              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">👆</span>
                  <div>
                    <h3>Click to Grow</h3>
                    <p>Every click adds an 's' and records your action on-chain</p>
                  </div>
                </div>

                <div className="feature-item">
                  <span className="feature-icon">🏆</span>
                  <div>
                    <h3>Unlock Achievements</h3>
                    <p>Reach milestones at 10, 50, 100, 500, and 1000 clicks</p>
                  </div>
                </div>

                <div className="feature-item">
                  <span className="feature-icon">🎨</span>
                  <div>
                    <h3>Earn NFTs</h3>
                    <p>Claim unique NFTs for each achievement milestone</p>
                  </div>
                </div>
              </div>

              <div className="onboarding-note">
                <strong>Note:</strong> Connect your wallet to Base Sepolia testnet to start. All clicks are recorded on-chain with sponsored transactions!
              </div>
            </div>

            <button className="onboarding-button" onClick={handleCloseOnboarding}>
              Get Started
            </button>
          </div>
        </div>
      )}

      <div className="wallet-section">
        <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <ConnectButton />
      </div>

      {isConnected && chainId === 84532 && activeNav === 'play' && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-label">Your Clicks</div>
            <div className="stat-value">{userClicks ? userClicks.toString() : '0'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Clicks</div>
            <div className="stat-value">{totalClicks ? totalClicks.toString() : '0'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Achievements</div>
            <div className="stat-value">{userAchievements ? userAchievements.length : '0'}</div>
          </div>
        </div>
      )}

      {/* Render current screen */}
      {renderScreen()}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeNav === 'play' ? 'active' : ''}`}
          onClick={() => setActiveNav('play')}
        >
          <span className="nav-icon">🎮</span>
          Play
        </button>
        <button
          className={`nav-item ${activeNav === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveNav('stats')}
        >
          <span className="nav-icon">📊</span>
          Stats
        </button>
        <button
          className={`nav-item ${activeNav === 'nft' ? 'active' : ''}`}
          onClick={() => setActiveNav('nft')}
        >
          <span className="nav-icon">🎨</span>
          NFTs
        </button>
        <button
          className={`nav-item ${activeNav === 'info' ? 'active' : ''}`}
          onClick={() => setShowOnboarding(true)}
        >
          <span className="nav-icon">ℹ️</span>
          Info
        </button>
      </nav>
    </div>
  )
}
