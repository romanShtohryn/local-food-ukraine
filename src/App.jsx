import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Map from './components/Map'
import AddSellerModal from './components/AddSellerModal'
import SellerDetails from './components/SellerDetails'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import AccountPage from './components/AccountPage'
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

  useEffect(() => {
    initializeAuth()
    loadSellers()
  }, [])

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
      await loadSellers()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAuthClick = () => {
    if (user) {
      setShowAccountPage(true)
    } else {
      setShowAuthPage(true)
      setAuthMode('signin')
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
        onBack={() => setShowAccountPage(false)}
      />
    )
  }

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        onLocate={handleLocate}
        onAddSeller={() => setIsModalOpen(true)}
        user={user}
        onAccount={handleAuthClick}
      />
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
        ) : (
          <Sidebar
            sellers={filteredSellers}
            onSellerClick={handleSellerClick}
            selectedSeller={selectedSeller}
            showDetails={showSellerDetails}
            selectedSellerDetails={selectedSeller}
            onBackToList={handleBackFromDetails}
          />
        )}
        <Map
          sellers={filteredSellers}
          selectedSeller={selectedSeller}
          onSellerSelect={handleSellerClick}
        />
      </main>
      <AddSellerModal
        isOpen={isModalOpen && user}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSeller}
        mapCenter={mapCenter}
      />
    </div>
  )
}

export default App
