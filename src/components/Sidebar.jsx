import { getCategoryIcon, getCategoryColor } from '../utils/contactHelpers'
import AdvertisementSpace from './AdvertisementSpace'

export default function Sidebar({ sellers, onSellerClick, selectedSeller, showDetails, selectedSellerDetails, onBackToList }) {
  if (showDetails && selectedSellerDetails) {
    return null
  }

  if (sellers.length === 0) {
    return (
      <aside className="sidebar">
        <div className="sidebar-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
          <p>Продавців не знайдено</p>
          <span>Спробуйте змінити фільтри або пошуковий запит</span>
        </div>
        <AdvertisementSpace position="sidebar" />
      </aside>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Знайдено: {sellers.length}</h2>
      </div>
      <div className="sellers-list">
        {sellers.map(seller => (
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
        ))}
      </div>
      <AdvertisementSpace position="sidebar" />
    </aside>
  )
}
