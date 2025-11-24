import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import SellerDetails from './components/SellerDetails'
import SettingsPage from './components/SettingsPage'
import Map from './components/Map'
import AddSellerModal from './components/AddSellerModal'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import AccountPage from './components/AccountPage'
import WelcomeAd from './components/WelcomeAd'
import UserMenu from './components/UserMenu'
import { sellersService } from './services/sellersService'
import { authService } from './services/authService'
import './App.css'

function App() {
  const [sellers, setSellers] = useState([])
  const [filteredSellers, setFilteredSellers] = useState([])
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [showSellerDetails, setShowSellerDetails] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState([48.9226, 24.7111])

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authMode, setAuthMode] = useState('signin')
  const [showAuthPage, setShowAuthPage] = useState(false)
  const [showAccountPage, setShowAccountPage] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  const [theme, setTheme] = useState('light')
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [currentSidebarTab, setCurrentSidebarTab] = useState('sellers')
  const [showWelcomeAd, setShowWelcomeAd] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    initializeAuth()
    loadSellers()
  }, [])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const initializeAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userProfile = await authService.getUserProfile(currentUser.id)
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  }

  const loadSellers = async () => {
    try {
      setIsLoading(true)
      const data = await sellersService.getAll()
      setSellers(data)
      setFilteredSellers(data)
    } catch (error) {
      console.error('Error loading sellers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query, category) => {
    try {
      const results = await sellersService.search(query, category)
      setFilteredSellers(results)
      setSelectedSeller(null)
      setShowSellerDetails(false)
      setCurrentSidebarTab('sellers')
    } catch (error) {
      console.error('Error searching sellers:', error)
    }
  }

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Геолокація недоступна у вашому браузері')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setMapCenter([latitude, longitude])
      },
      () => {
        alert('Не вдалося отримати геолокацію')
      }
    )
  }

  const handleAddSeller = async (sellerData) => {
    try {
      await sellersService.create({
        ...sellerData,
        user_id: user?.id
      })
      await loadSellers()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding seller:', error)
      throw error
    }
  }

  const handleDeleteSeller = async (sellerId) => {
    try {
      await sellersService.delete(sellerId)
      await loadSellers()
      setShowSellerDetails(false)
      setSelectedSeller(null)
    } catch (error) {
      console.error('Error deleting seller:', error)
      throw error
    }
  }

  const handleSellerClick = (seller) => {
    setSelectedSeller(seller)
    setShowSellerDetails(true)
  }

  const handleBackFromDetails = () => {
    setShowSellerDetails(false)
    setSelectedSeller(null)
    setCurrentSidebarTab('sellers')
  }

  const handleSignIn = async (email, password) => {
    try {
      const { user: authUser } = await authService.signIn(email, password)
      setUser(authUser)
      const userProfile = await authService.getUserProfile(authUser.id)
      setProfile(userProfile)
      setShowAuthPage(false)
    } catch (error) {
      throw error
    }
  }

  const handleSignUp = async (email, password, fullName) => {
    try {
      const { user: authUser } = await authService.signUp(email, password, fullName)
      setUser(authUser)
      const userProfile = await authService.getUserProfile(authUser.id)
      setProfile(userProfile)
      setShowAuthPage(false)
      setAuthMode('signin')
    } catch (error) {
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setProfile(null)
      setShowAccountPage(false)
      setShowAuthPage(false)
      setShowSettings(false)
      setShowAbout(false)
      setCurrentSidebarTab('sellers')
      setShowUserMenu(false)
      await loadSellers()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleBecomeSeller = () => {
    if (!user) {
      setShowAuthPage(true)
      setAuthMode('signin')
    } else {
      setCurrentSidebarTab('become-seller')
      setShowSellerDetails(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Завантаження...</p>
      </div>
    )
  }

  if (showAuthPage) {
    if (authMode === 'signin') {
      return <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthMode('signup')} />
    } else {
      return <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthMode('signin')} />
    }
  }

  if (showAccountPage) {
    return (
      <AccountPage
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
        onBack={() => {
          setShowAccountPage(false)
          setShowUserMenu(false)
        }}
      />
    )
  }

  return (
    <div className="app" data-theme={theme}>
      <Header
        onSearch={handleSearch}
        onLocate={handleLocate}
        user={user}
        onUserMenuClick={() => setShowUserMenu(!showUserMenu)}
        showUserMenu={showUserMenu}
        onMenuAction={() => {
          setShowAuthPage(true)
          setAuthMode('signin')
        }}
      />

      {showUserMenu && user && (
        <UserMenu
          user={user}
          onAccount={() => {
            setShowAccountPage(true)
            setShowUserMenu(false)
          }}
          onBecomeSeller={() => {
            setCurrentSidebarTab('become-seller')
            setShowSellerDetails(false)
            setShowUserMenu(false)
          }}
          onSettings={() => {
            setShowSettings(true)
            setShowUserMenu(false)
          }}
          onAbout={() => {
            setCurrentSidebarTab('about')
            setShowSellerDetails(false)
            setShowUserMenu(false)
          }}
          onSignOut={handleSignOut}
          onClose={() => setShowUserMenu(false)}
        />
      )}

      <main className="main-content">
        {showSellerDetails && selectedSeller ? (
          <div className="sidebar-container">
            <SellerDetails
              seller={selectedSeller}
              onBack={handleBackFromDetails}
              user={user}
              onDeleteSeller={handleDeleteSeller}
              onEditStart={() => {}}
            />
          </div>
        ) : showSettings ? (
          <SettingsPage
            theme={theme}
            onThemeChange={handleThemeChange}
            onBack={() => setShowSettings(false)}
          />
        ) : sidebarVisible ? (
          <Sidebar
            sellers={filteredSellers}
            onSellerClick={handleSellerClick}
            selectedSeller={selectedSeller}
            currentTab={currentSidebarTab}
            onTabChange={setCurrentSidebarTab}
            onBecomeSeller={handleBecomeSeller}
          />
        ) : null}

        <Map
          sellers={filteredSellers}
          selectedSeller={selectedSeller}
          onSellerSelect={handleSellerClick}
          mapCenter={mapCenter}
        />

        {sidebarVisible && (
          <button className="toggle-sidebar" onClick={() => setSidebarVisible(false)} title="Сховати список">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {!sidebarVisible && (
          <button className="toggle-sidebar show" onClick={() => setSidebarVisible(true)} title="Показати список">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </main>

      <AddSellerModal
        isOpen={isModalOpen && user}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSeller}
        mapCenter={mapCenter}
      />

      {showWelcomeAd && <WelcomeAd onClose={() => setShowWelcomeAd(false)} />}
    </div>
  )
}

export default App
