import { useState, useEffect } from 'react'

export default function WelcomeAd({ onClose }) {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const shown = localStorage.getItem('welcomeAdShown')
    if (!shown) {
      setIsShown(true)
      localStorage.setItem('welcomeAdShown', 'true')
    }
  }, [])

  if (!isShown) return null

  return (
    <div className="welcome-ad-overlay">
      <div className="welcome-ad-modal">
        <button className="welcome-ad-close" onClick={onClose} aria-label="Закрити">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="welcome-ad-content">
          <div className="welcome-ad-graphic">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="50" cy="50" r="45" />
              <path d="M50 30v40M30 50h40M35 35l30 30M65 35l-30 30" strokeLinecap="round" />
            </svg>
          </div>

          <h2>Тут може бути Ваша реклама</h2>
          <p>Станьте партнером Local Food Ukraine і отримайте доступ до тисяч покупців</p>

          <button className="welcome-ad-button" onClick={onClose}>
            Розумію, спасибі
          </button>
        </div>
      </div>
    </div>
  )
}
