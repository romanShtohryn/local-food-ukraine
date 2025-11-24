import { useState, useEffect } from 'react'

export default function SettingsPage({ theme, onThemeChange, onBack }) {
  const [isDark, setIsDark] = useState(theme === 'dark')

  const handleThemeToggle = (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light'
    setIsDark(e.target.checked)
    onThemeChange(newTheme)
  }

  return (
    <aside className="sidebar">
      <button onClick={onBack} className="btn-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Назад
      </button>

      <div className="settings-content">
        <h2>Налаштування</h2>

        <div className="settings-section">
          <h3>Тема</h3>
          <div className="settings-item">
            <label className="theme-toggle">
              <input
                type="checkbox"
                checked={isDark}
                onChange={handleThemeToggle}
              />
              <span className="toggle-label">
                {isDark ? 'Темна тема' : 'Світла тема'}
              </span>
            </label>
            <p className="setting-description">
              {isDark ? 'Зараз увімкнена темна тема' : 'Зараз увімкнена світла тема'}
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3>Про програму</h3>
          <div className="settings-item">
            <p>Local Food Ukraine v1.0.0</p>
            <p className="setting-description">Платформа для локальних виробників</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
