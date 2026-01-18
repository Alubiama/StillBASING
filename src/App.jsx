import { useState } from 'react'
import './App.css'

export default function App() {
  const [isStretched, setIsStretched] = useState(false)
  const [isSquareFading, setIsSquareFading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sCount, setSCount] = useState(1)
  const [currentWidth, setCurrentWidth] = useState(240) // Текущая ширина кнопки
  const [showExtraS, setShowExtraS] = useState(false) // Показывать ли дополнительную 's' за квадратом

  const widthIncrement = 22 // Ширина одной буквы 's' при шрифте 32px Inter Bold
  const stretchAmount = 160 // На сколько растягивается временно

  const handleClick = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setIsStretched(true)
    setShowExtraS(true) // Показываем дополнительную 's' сразу с квадратом

    setTimeout(() => {
      setIsSquareFading(true) // Квадрат начинает исчезать (750ms transition)
    }, 1200)

    // Ждём пока квадрат полностью исчезнет (1200 + 750 = 1950ms)
    setTimeout(() => {
      // Добавляем 's' в основной текст и увеличиваем ширину
      setSCount(prev => prev + 1)
      setCurrentWidth(prev => prev + widthIncrement)

      // Небольшая задержка для React, чтобы обновить DOM
      setTimeout(() => {
        // Убираем квадрат и временную 's', схлопываем кнопку
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
