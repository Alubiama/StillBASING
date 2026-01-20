import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useWriteContracts } from 'wagmi/experimental'
import { CONTRACTS } from '../contracts/addresses'
import { BasingCounterABI } from '../contracts/BasingCounterABI'
import { usePaymasterCapabilities } from '../hooks/usePaymasterCapabilities'

export default function PlayScreen() {
  const { address, isConnected, chainId } = useAccount()
  const [isStretched, setIsStretched] = useState(false)
  const [isSquareFading, setIsSquareFading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sCount, setSCount] = useState(1)
  const [currentWidth, setCurrentWidth] = useState(240)
  const [showExtraS, setShowExtraS] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const widthIncrement = 22
  const stretchAmount = 160

  // Contract interactions with sponsored transactions using experimental hooks
  // This enables gasless transactions for Base Mini Apps Featured requirements
  const { capabilities, isPaymasterSupported } = usePaymasterCapabilities()

  const { writeContracts, isPending } = useWriteContracts({
    mutation: {
      onSuccess: (id) => {
        setIsConfirmed(true)
        // Reset confirmation after 3 seconds
        setTimeout(() => setIsConfirmed(false), 3000)
      },
      onError: (error) => {
        console.error('Transaction failed:', error)
      },
    },
  })

  const handleClick = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setIsStretched(true)
    setShowExtraS(true)

    // Record click on-chain if wallet connected
    // Using sponsored transactions for gasless experience (Base Mini Apps Featured requirement)
    if (isConnected && chainId === 84532) {
      writeContracts({
        contracts: [
          {
            address: CONTRACTS.baseSepolia.BasingCounter,
            abi: BasingCounterABI,
            functionName: 'recordClick',
          },
        ],
        capabilities, // Enable paymaster for gasless transactions
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
            {isPaymasterSupported ? 'Recording (gasless)...' : 'Waiting for approval...'}
          </p>
        )}
        {isConfirmed && (
          <p className="status-text success">
            Click recorded! ✓ {isPaymasterSupported && '(No gas fees!)'}
          </p>
        )}

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
