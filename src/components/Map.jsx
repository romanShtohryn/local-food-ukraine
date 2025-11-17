import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getCategoryColor } from '../utils/contactHelpers'
import { extractPhone, makeMessengerLink } from '../utils/contactHelpers'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function Map({ sellers, selectedSeller, onSellerSelect }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: true
      }).setView([48.9226, 24.7111], 7)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    if (sellers.length === 0) return

    const bounds = []

    sellers.forEach(seller => {
      const color = getCategoryColor(seller.category)

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin" style="background-color: ${color}">
                 <div class="marker-inner"></div>
               </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
      })

      const marker = L.marker([seller.lat, seller.lng], {
        icon: customIcon,
        title: seller.name
      })

      const phone = extractPhone(seller.contact)
      const messengerLink = makeMessengerLink(seller.contact)

      const popupContent = `
        <div class="map-popup">
          <div class="popup-header">
            <h3>${seller.name}</h3>
            <span class="popup-category">${seller.category}</span>
          </div>
          <div class="popup-body">
            <p class="popup-product">${seller.product}</p>
            ${seller.price ? `<p class="popup-price">${seller.price}</p>` : ''}
            ${seller.city ? `<p class="popup-city">${seller.city}</p>` : ''}
          </div>
          <div class="popup-actions">
            ${phone ? `<a href="tel:${phone}" class="popup-btn popup-btn-call">Дзвінок</a>` : ''}
            ${messengerLink !== '#' ? `<a href="${messengerLink}" target="_blank" class="popup-btn popup-btn-message">Написати</a>` : ''}
          </div>
          <div class="popup-contact">${seller.contact}</div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      })

      marker.on('click', () => {
        onSellerSelect(seller)
      })

      marker.addTo(mapInstanceRef.current)
      markersRef.current.push(marker)
      bounds.push([seller.lat, seller.lng])
    })

    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [sellers, onSellerSelect])

  useEffect(() => {
    if (selectedSeller && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedSeller.lat, selectedSeller.lng], 14)

      const marker = markersRef.current.find(m => {
        const latLng = m.getLatLng()
        return latLng.lat === selectedSeller.lat && latLng.lng === selectedSeller.lng
      })

      if (marker) {
        marker.openPopup()
      }
    }
  }, [selectedSeller])

  return <div ref={mapRef} className="map-container" />
}
