export function extractPhone(contact) {
  const match = contact.match(/(\+?\d[\d\s-]{7,})/)
  return match ? match[1].replace(/[\s-]/g, '') : ''
}

export function makeMessengerLink(contact) {
  const telegram = contact.match(/@([A-Za-z0-9_]+)/)
  if (telegram) return `https://t.me/${telegram[1]}`

  const phone = extractPhone(contact)
  if (phone) return `viber://chat?number=${encodeURIComponent(phone)}`

  return '#'
}

export function getCategoryIcon(category) {
  const icons = {
    'молоко': '🥛',
    'м\'ясо': '🥩',
    'мед': '🍯',
    'овочі': '🥬',
    'фрукти': '🍎',
    'яйця': '🥚'
  }
  return icons[category] || '🏪'
}

export function getCategoryColor(category) {
  const colors = {
    'молоко': '#4A90E2',
    'м\'ясо': '#E24A4A',
    'мед': '#F5A623',
    'овочі': '#7ED321',
    'фрукти': '#FF6B6B',
    'яйця': '#FFD93D'
  }
  return colors[category] || '#666'
}
