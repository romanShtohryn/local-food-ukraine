import { useState } from 'react'
import { getCategoryIcon, getCategoryColor, extractPhone, makeMessengerLink } from '../utils/contactHelpers'

export default function SellerDetails({ seller, onBack, user, onDeleteSeller, onEditStart }) {
  const isOwner = user && user.id === seller.user_id
  const [isDeleting, setIsDeleting] = useState(false)
  const phone = extractPhone(seller.contact)
  const messengerLink = makeMessengerLink(seller.contact)

  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цього продавця?')) {
      setIsDeleting(true)
      try {
        await onDeleteSeller(seller.id)
        onBack()
      } catch (error) {
        alert('Помилка при видаленні')
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="seller-details">
      <button onClick={onBack} className="btn-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        До списку
      </button>

      <div className="details-header">
        <div className="details-icon" style={{ background: getCategoryColor(seller.category) }}>
          {getCategoryIcon(seller.category)}
        </div>
        <div className="details-title">
          <h2>{seller.name}</h2>
          <span className="details-category">{seller.category}</span>
        </div>
      </div>

      <div className="details-section">
        <h3>Продукція</h3>
        <p className="details-product">{seller.product}</p>
      </div>

      {seller.price && (
        <div className="details-section">
          <h3>Ціна</h3>
          <p className="details-price">{seller.price}</p>
        </div>
      )}

      {seller.city && (
        <div className="details-section">
          <h3>Місцезнаходження</h3>
          <div className="details-location">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {seller.city}
          </div>
        </div>
      )}

      <div className="details-section">
        <h3>Координати</h3>
        <div className="details-coordinates">
          <span>{seller.lat.toFixed(6)}, {seller.lng.toFixed(6)}</span>
        </div>
      </div>

      <div className="details-section">
        <h3>Контакт</h3>
        <p className="details-contact">{seller.contact}</p>
        <div className="contact-actions">
          {phone && (
            <a href={`tel:${phone}`} className="contact-btn contact-call">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Дзвінок
            </a>
          )}
          {messengerLink !== '#' && (
            <a href={messengerLink} target="_blank" rel="noopener noreferrer" className="contact-btn contact-message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v-2h8v2zm0-3h-8V9h8v2zm0-3H4V4h14v4z"/>
              </svg>
              Написати
            </a>
          )}
        </div>
      </div>

      {isOwner && (
        <div className="details-actions">
          <button onClick={onEditStart} className="btn-secondary">
            Редагувати
          </button>
          <button onClick={handleDelete} className="btn-danger" disabled={isDeleting}>
            {isDeleting ? 'Видалення...' : 'Видалити'}
          </button>
        </div>
      )}
    </div>
  )
}
