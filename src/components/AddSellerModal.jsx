import { useState } from 'react'

const CATEGORIES = [
  { value: '', label: 'Оберіть категорію' },
  { value: 'молоко', label: 'Молоко' },
  { value: 'м\'ясо', label: 'М\'ясо' },
  { value: 'мед', label: 'Мед' },
  { value: 'овочі', label: 'Овочі' },
  { value: 'фрукти', label: 'Фрукти' },
  { value: 'яйця', label: 'Яйця' }
]

export default function AddSellerModal({ isOpen, onClose, onSubmit, mapCenter }) {
  const [formData, setFormData] = useState({
    name: '',
    product: '',
    category: '',
    price: '',
    contact: '',
    city: '',
    lat: mapCenter?.[0] || 48.9226,
    lng: mapCenter?.[1] || 24.7111
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Геолокація недоступна у вашому браузері')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }))
      },
      () => {
        alert('Не вдалося отримати геолокацію')
      }
    )
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Ім\'я є обов\'язковим'
    if (!formData.product.trim()) newErrors.product = 'Вкажіть продукцію'
    if (!formData.category) newErrors.category = 'Оберіть категорію'
    if (!formData.contact.trim()) newErrors.contact = 'Вкажіть контакт'
    if (isNaN(formData.lat) || isNaN(formData.lng)) {
      newErrors.coordinates = 'Невірні координати'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      })

      setFormData({
        name: '',
        product: '',
        category: '',
        price: '',
        contact: '',
        city: '',
        lat: mapCenter?.[0] || 48.9226,
        lng: mapCenter?.[1] || 24.7111
      })
      setErrors({})
      onClose()
    } catch (error) {
      setErrors({ submit: 'Помилка при додаванні продавця' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Додати нового продавця</h2>
          <button onClick={onClose} className="modal-close" aria-label="Закрити">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="name">Ім'я продавця</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Іван Петренко"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="product">Продукція</label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              placeholder="Молоко домашнє, мед акацієвий..."
              className={errors.product ? 'error' : ''}
            />
            {errors.product && <span className="error-message">{errors.product}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категорія</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Ціна</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="60 грн/л"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact">Контакт</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Тел: 050-123-45-67 або Telegram: @username"
              className={errors.contact ? 'error' : ''}
            />
            {errors.contact && <span className="error-message">{errors.contact}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="city">Населений пункт</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Івано-Франківськ, с. Хриплин..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lat">Широта</label>
              <input
                type="number"
                id="lat"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                step="0.000001"
                placeholder="48.9226"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lng">Довгота</label>
              <input
                type="number"
                id="lng"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                step="0.000001"
                placeholder="24.7111"
              />
            </div>
          </div>

          {errors.coordinates && <span className="error-message">{errors.coordinates}</span>}

          <button type="button" onClick={handleUseLocation} className="btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Використати мою геолокацію
          </button>

          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Скасувати
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Збереження...' : 'Зберегти продавця'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
