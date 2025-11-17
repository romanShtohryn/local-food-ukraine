import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Map from './components/Map'
import AddSellerModal from './components/AddSellerModal'
import { sellersService } from './services/sellersService'
import './App.css'

function App() {
  const [sellers, setSellers] = useState([])
  const [filteredSellers, setFilteredSellers] = useState([])
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState([48.9226, 24.7111])

  useEffect(() => {
    loadSellers()
  }, [])

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
      await sellersService.create(sellerData)
      await loadSellers()
    } catch (error) {
      console.error('Error adding seller:', error)
      throw error
    }
  }

  const handleSellerClick = (seller) => {
    setSelectedSeller(seller)
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        onLocate={handleLocate}
        onAddSeller={() => setIsModalOpen(true)}
      />
      <main className="main-content">
        <Sidebar
          sellers={filteredSellers}
          onSellerClick={handleSellerClick}
          selectedSeller={selectedSeller}
        />
        <Map
          sellers={filteredSellers}
          selectedSeller={selectedSeller}
          onSellerSelect={handleSellerClick}
        />
      </main>
      <AddSellerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSeller}
        mapCenter={mapCenter}
      />
    </div>
  )
}

export default App
