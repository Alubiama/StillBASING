import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../contracts/addresses'
import { BasingCounterABI } from '../contracts/BasingCounterABI'

export default function PlayScreen() {
  const { address, isConnected, chainId } = useAccount()
  const [isStretched, setIsStretched] = useState(false)
  const [isSquareFading, setIsSquareFading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sCount, setSCount] = useState(1)
  const [currentWidth, setCurrentWidth] = useState(240)
  const [showExtraS, setShowExtraS] = useState(false)

  const widthIncrement = 22
  const stretchAmount = 160

  // Contract interactions with sponsored transactions
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

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

  return (
    <div className="screen-container">
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
    </div>
  )
}
