import { useState } from 'react'

export default function SignUp({ onSignUp, onSwitchToSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    if (!email.trim()) {
      setError('Вкажіть електронну пошту')
      return false
    }
    if (!fullName.trim()) {
      setError('Вкажіть своє ім\'я')
      return false
    }
    if (password.length < 6) {
      setError('Пароль повинен містити мінімум 6 символів')
      return false
    }
    if (password !== confirmPassword) {
      setError('Паролі не співпадають')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setIsLoading(true)

    try {
      await onSignUp(email, password, fullName)
    } catch (err) {
      setError(err.message || 'Помилка при реєстрації')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="Local Food Ukraine" className="auth-logo" />
          <h1>Local Food Ukraine</h1>
          <p className="auth-subtitle">Карта місцевих фермерів</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Створити акаунт</h2>

          <div className="form-group">
            <label htmlFor="fullName">Повне ім'я</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Іван Петренко"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Електронна пошта</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
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
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : 'Зареєструватися'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Вже маєте акаунт? <button type="button" onClick={onSwitchToSignIn} className="link-btn">Увійти</button></p>
        </div>
      </div>
    </div>
  )
}
