import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from './contracts/addresses'
import { BasingCounterABI } from './contracts/BasingCounterABI'
import { BasingNFTABI } from './contracts/BasingNFTABI'
import './App.css'

export default function App() {
  const { address, isConnected, chainId } = useAccount()
  const [isStretched, setIsStretched] = useState(false)
  const [isSquareFading, setIsSquareFading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sCount, setSCount] = useState(1)
  const [currentWidth, setCurrentWidth] = useState(240)
  const [showExtraS, setShowExtraS] = useState(false)

  const widthIncrement = 22
  const stretchAmount = 160

  // Contract interactions
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
    if (isConnected && chainId === 84532) {
      writeContract({
        address: CONTRACTS.baseSepolia.BasingCounter,
        abi: BasingCounterABI,
        functionName: 'recordClick',
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

  return (
    <div className="app">
      <div className="wallet-section">
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

        {isPending && <p className="status-text">Waiting for approval...</p>}
        {isConfirming && <p className="status-text">Recording on-chain...</p>}
        {isConfirmed && <p className="status-text success">Click recorded! ✓</p>}

        <button
          className="restart-button"
          onClick={handleHardRestart}
        >
          Жесткий рестарт
        </button>
      </div>
    </div>
  )
}
