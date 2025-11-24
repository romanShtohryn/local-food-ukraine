import { useState } from 'react'
import { getCategoryIcon, getCategoryColor } from '../utils/contactHelpers'

const CATEGORIES = [
  { value: '', label: 'Всі' },
  { value: 'молоко', label: 'Молоко' },
  { value: 'м\'ясо', label: 'М\'ясо' },
  { value: 'мед', label: 'Мед' },
  { value: 'овочі', label: 'Овочі' },
  { value: 'фрукти', label: 'Фрукти' },
  { value: 'яйця', label: 'Яйця' }
]

export default function Sidebar({ sellers, onSellerClick, selectedSeller, currentTab, onTabChange, onBecomeSeller }) {
  const [activeCategory, setActiveCategory] = useState('')

  const filteredSellers = activeCategory
    ? sellers.filter(s => s.category === activeCategory)
    : sellers

  const sellersWithAds = []
  filteredSellers.forEach((seller, index) => {
    sellersWithAds.push({ type: 'seller', data: seller })
    if ((index + 1) % 4 === 0 && index !== filteredSellers.length - 1) {
      sellersWithAds.push({ type: 'ad', data: { id: `ad-${index}` } })
    }
  })

  if (currentTab === 'sellers' && filteredSellers.length === 0) {
    return (
      <aside className="sidebar">
        <div className="sidebar-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`sidebar-tab ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="sidebar-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
          <p>Продавців не знайдено</p>
          <span>Спробуйте змінити фільтри</span>
        </div>
      </aside>
    )
  }

  if (currentTab === 'sellers') {
    return (
      <aside className="sidebar">
        <div className="sidebar-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`sidebar-tab ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="sidebar-header">
          <h2>Знайдено: {filteredSellers.length}</h2>
        </div>
        <div className="sellers-list">
          {sellersWithAds.map((item, index) => {
            if (item.type === 'ad') {
              return (
                <div key={item.data.id} className="seller-card ad-card">
                  <div className="ad-card-content">
                    <p>Тут може бути Ваша реклама</p>
                  </div>
                </div>
              )
            }

            const seller = item.data
            return (
              <div
                key={seller.id}
                className={`seller-card ${selectedSeller?.id === seller.id ? 'active' : ''}`}
                onClick={() => onSellerClick(seller)}
              >
                <div className="seller-card-header">
                  <div className="seller-icon" style={{ background: getCategoryColor(seller.category) }}>
                    {getCategoryIcon(seller.category)}
                  </div>
                  <div className="seller-info">
                    <h3>{seller.name}</h3>
                    <p className="seller-product">{seller.product}</p>
                  </div>
                </div>
                <div className="seller-card-body">
                  <div className="seller-meta">
                    <span className="seller-category">{seller.category}</span>
                    {seller.price && <span className="seller-price">{seller.price}</span>}
                  </div>
                  {seller.city && (
                    <div className="seller-location">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {seller.city}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </aside>
    )
  }

  if (currentTab === 'become-seller') {
    return (
      <aside className="sidebar">
        <div className="sidebar-content-section">
          <h2>Стати продавцем</h2>
          <p>Почніть продавати свої продукти на нашій платформі</p>
          <button onClick={onBecomeSeller} className="btn-primary">
            Додати своє перше оголошення
          </button>
        </div>
      </aside>
    )
  }

  if (currentTab === 'about') {
    return (
      <aside className="sidebar">
        <div className="sidebar-content-section">
          <h2>Про нас</h2>
          <p>Local Food Ukraine - це платформа для прямого спілкування між місцевими виробниками та покупцями.</p>
          <p>Ми допомагаємо фермерам та виробникам продуктів знайти своїх клієнтів та розвивати свій бізнес.</p>
        </div>
      </aside>
    )
  }

  return null
}
