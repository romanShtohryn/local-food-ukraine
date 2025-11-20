import { useState, useEffect } from 'react'
import { authService } from '../services/authService'

export default function AccountPage({ user, profile, onSignOut, onBack }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await authService.updateProfile(user.id, formData)
      setSuccess('Профіль успішно оновлено')
      setIsEditing(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Помилка при оновленні профілю')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Пароль повинен містити мінімум 6 символів')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Паролі не співпадають')
      return
    }

    setIsLoading(true)

    try {
      await authService.updatePassword(newPassword)
      setSuccess('Пароль успішно змінено')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Помилка при зміні пароля')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setError('')
    setIsLoading(true)

    try {
      await authService.deleteAccount()
      onSignOut()
    } catch (err) {
      setError(err.message || 'Помилка при видаленні акаунту')
      setIsLoading(false)
    }
  }

  return (
    <div className="account-page">
      <button onClick={onBack} className="btn-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Назад
      </button>

      <div className="account-container">
        <div className="account-header">
          <h1>Мій акаунт</h1>
          <p className="account-email">{user.email}</p>
        </div>

        {error && <div className="form-error account-error">{error}</div>}
        {success && <div className="form-success account-success">{success}</div>}

        <div className="account-section">
          <div className="section-header">
            <h2>Профіль</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-secondary">
                Редагувати
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="form-group">
                <label htmlFor="full_name">Повне ім'я</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380..."
                  disabled={isLoading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      full_name: profile?.full_name || '',
                      phone: profile?.phone || ''
                    })
                  }}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Збереження...' : 'Зберегти'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Ім'я:</span>
                <span className="info-value">{formData.full_name || 'Не вказано'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Телефон:</span>
                <span className="info-value">{formData.phone || 'Не вказано'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Електронна пошта:</span>
                <span className="info-value">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        <div className="account-section">
          <div className="section-header">
            <h2>Безпека</h2>
          </div>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn-secondary"
            >
              Змінити пароль
            </button>
          ) : (
            <form onSubmit={handleUpdatePassword} className="edit-form">
              <div className="form-group">
                <label htmlFor="newPassword">Новий пароль</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Підтвердіть пароль</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Збереження...' : 'Змінити'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="account-section danger-zone">
          <h2>Небезпечна зона</h2>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger"
            >
              Видалити акаунт
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Ви впевнені? Цю дію неможливо скасувати.</p>
              <div className="form-actions">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Скасувати
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn-danger"
                  disabled={isLoading}
                >
                  {isLoading ? 'Видалення...' : 'Видалити акаунт'}
                </button>
              </div>
            </div>
          )}
        </div>

        <button onClick={onSignOut} className="btn-secondary btn-signout">
          Вийти
        </button>
      </div>
    </div>
  )
}
