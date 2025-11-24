import { useState } from 'react'

export default function UserMenu({ user, onAccount, onBecomeSeller, onSettings, onAbout, onSignOut, onClose }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleMenuClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleSignOut = () => {
    handleMenuClose()
    onSignOut()
  }

  const handleBecomeSeller = () => {
    handleMenuClose()
    onBecomeSeller()
  }

  const handleSettings = () => {
    handleMenuClose()
    onSettings()
  }

  const handleAbout = () => {
    handleMenuClose()
    onAbout()
  }

  const handleAccount = () => {
    handleMenuClose()
    onAccount()
  }

  return (
    <div className="user-menu-wrapper">
      <div className={`user-menu ${isOpen ? 'open' : ''}`}>
        <button className="user-menu-item" onClick={handleAccount}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          Мій аккаунт
        </button>

        <button className="user-menu-item" onClick={handleBecomeSeller}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 7h-8V4c0-.55-.45-1-1-1s-1 .45-1 1v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-1 12H5V9h14v10z"/>
          </svg>
          Стати продавцем
        </button>

        <button className="user-menu-item" onClick={handleAbout}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Про нас
        </button>

        <button className="user-menu-item" onClick={handleSettings}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          Налаштування
        </button>

        <div className="user-menu-divider"></div>

        <button className="user-menu-item user-menu-signout" onClick={handleSignOut}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Вихід
        </button>
      </div>
    </div>
  )
}
