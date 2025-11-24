import { useState } from 'react'

const CATEGORIES = [
  { value: '', label: 'Всі категорії' },
  { value: 'молоко', label: 'Молоко' },
  { value: 'м\'ясо', label: 'М\'ясо' },
  { value: 'мед', label: 'Мед' },
  { value: 'овочі', label: 'Овочі' },
  { value: 'фрукти', label: 'Фрукти' },
  { value: 'яйця', label: 'Яйця' }
]

export default function Header({ onSearch, onLocate, user, onUserMenuClick, showUserMenu, onMenuAction }) {
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchText(value)
    onSearch(value, category)
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory(value)
    onSearch(searchText, value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(searchText, category)
  }

  return (
    <header className="header">
      <div className="header-brand">
        <img src="/logo.png" alt="Local Food Ukraine" className="logo" />
        <h1 className="brand-name">Local Food Ukraine</h1>
      </div>

      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Пошук продавців, продукції або населеного пункту..."
            value={searchText}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <select
          value={category}
          onChange={handleCategoryChange}
          className="category-select"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </form>

      <div className="header-actions">
        <button onClick={onLocate} className="btn-icon" title="Моє місцезнаходження">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </button>

        {user ? (
          <button onClick={onUserMenuClick} className="btn-icon" title="Меню">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </button>
        ) : (
          <button onClick={onMenuAction} className="btn-primary">
            Вхід / Реєстрація
          </button>
        )}
      </div>
    </header>
  )
}
