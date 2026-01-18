import { useState, useEffect } from 'react'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from './contracts/addresses'
import { BasingCounterABI } from './contracts/BasingCounterABI'
import { BasingNFTABI } from './contracts/BasingNFTABI'
import './App.css'

export default function App() {
  const { address, isConnected, chainId } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [isStretched, setIsStretched] = useState(false)
  const [isSquareFading, setIsSquareFading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sCount, setSCount] = useState(1)
  const [currentWidth, setCurrentWidth] = useState(240)
  const [showExtraS, setShowExtraS] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_completed')
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dark_mode') === 'true' ||
           window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [activeNav, setActiveNav] = useState('play')

  const widthIncrement = 22
  const stretchAmount = 160

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

  // Contract interactions with sponsored transactions
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Read user clicks from contract
  const { data: userClicks, refetch: refetchClicks } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getUserClicks',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Read total clicks from contract
  const { data: totalClicks, refetch: refetchTotal } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'totalClicks',
    enabled: chainId === 84532,
  })

  // Read user achievements
  const { data: userAchievements, refetch: refetchAchievements } = useReadContract({
    address: chainId === 84532 ? CONTRACTS.baseSepolia.BasingCounter : undefined,
    abi: BasingCounterABI,
    functionName: 'getUserAchievements',
    args: address ? [address] : undefined,
    enabled: !!address && chainId === 84532,
  })

  // Refetch data when transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      refetchClicks()
      refetchTotal()
      refetchAchievements()
    }
  }, [isConfirmed, refetchClicks, refetchTotal, refetchAchievements])

  const handleClick = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setIsStretched(true)
    setShowExtraS(true)

    // Record click on-chain if wallet connected
    // Using sponsored transactions for gasless experience
    if (isConnected && chainId === 84532) {
      writeContract({
        address: CONTRACTS.baseSepolia.BasingCounter,
        abi: BasingCounterABI,
        functionName: 'recordClick',
        // Sponsored transaction - no gas fees for users
        gas: undefined, // Let the network estimate gas
      })
    }

    setTimeout(() => {
      setIsSquareFading(true)
    }, 1200)

    setTimeout(() => {
      setSCount(prev => prev + 1)
      setCurrentWidth(prev => prev + widthIncrement)

      setTimeout(() => {
        setIsStretched(false)
        setIsSquareFading(false)
        setShowExtraS(false)
        setIsAnimating(false)
      }, 100)
    }, 1950)
  }

  const handleHardRestart = () => {
    setIsStretched(false)
    setIsSquareFading(false)
    setIsAnimating(false)
    setSCount(1)
    setCurrentWidth(240)
    setShowExtraS(false)
  }

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboarding_completed', 'true')
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
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

      {isConnected && chainId === 84532 && (
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

      <div className="container">
        <div
          className={`button ${isStretched ? 'stretched' : ''}`}
          onClick={handleClick}
          style={{
            cursor: isAnimating ? 'default' : 'pointer',
            width: isStretched ? `${currentWidth + stretchAmount}px` : `${currentWidth}px`
          }}
        >
          <div className="text-container">
            <span className="text-part">Still ba{'s'.repeat(sCount)}</span>
            <span className="square-space">
              {isStretched && (
                <>
                  <span className={`square-icon ${isSquareFading ? 'fading' : ''}`}></span>
                  {showExtraS && <span className="extra-s">s</span>}
                </>
              )}
            </span>
            <span className="text-part">ing</span>
          </div>
        </div>

        {isPending && (
          <p className="status-text">
            <span className="loading-spinner"></span>
            Waiting for approval...
          </p>
        )}
        {isConfirming && (
          <p className="status-text">
            <span className="loading-spinner"></span>
            Recording on-chain...
          </p>
        )}
        {isConfirmed && <p className="status-text success">Click recorded! ✓</p>}

        <button
          className="restart-button"
          onClick={handleHardRestart}
        >
          Жесткий рестарт
        </button>
      </div>

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
