import { useState } from 'react'

export default function SignIn({ onSignIn, onSwitchToSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await onSignIn(email, password)
    } catch (err) {
      setError(err.message || 'Помилка при вході')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src="/logo.png" alt="Local Food Ukraine" className="auth-logo" />
          <h1>Local Food Ukraine</h1>
          <p className="auth-subtitle">Карта місцевих фермерів</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Вхід до акаунту</h2>

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

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Немаєте акаунту? <button type="button" onClick={onSwitchToSignUp} className="link-btn">Зареєструватися</button></p>
        </div>
      </div>
    </div>
  )
}
