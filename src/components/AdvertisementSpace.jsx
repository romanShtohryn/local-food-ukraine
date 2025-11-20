export default function AdvertisementSpace({ position = 'sidebar' }) {
  const getAdContent = () => {
    const ads = [
      {
        title: 'Здоров\'я дома',
        description: 'Купуйте свіжі екологічні продукти прямо від фермерів',
        cta: 'Дізнатися більше'
      },
      {
        title: 'Органічні продукти',
        description: 'Без пестицидів і хімікатів',
        cta: 'Переглянути'
      },
      {
        title: 'Прямо від виробника',
        description: 'Найкраща якість за справедливою ціною',
        cta: 'Дізнатися'
      }
    ]
    return ads[Math.floor(Math.random() * ads.length)]
  }

  const ad = getAdContent()

  if (position === 'sidebar') {
    return (
      <div className="advertisement-space advertisement-sidebar">
        <div className="ad-content">
          <span className="ad-label">Оголошення</span>
          <h3>{ad.title}</h3>
          <p>{ad.description}</p>
          <button className="ad-button">{ad.cta}</button>
        </div>
      </div>
    )
  }

  if (position === 'header') {
    return (
      <div className="advertisement-space advertisement-header">
        <div className="ad-content">
          <span className="ad-label">Оголошення</span>
          <p>{ad.description}</p>
          <button className="ad-button">{ad.cta}</button>
        </div>
      </div>
    )
  }

  if (position === 'map') {
    return (
      <div className="advertisement-space advertisement-map">
        <div className="ad-content">
          <span className="ad-label">Спонсор</span>
          <h3>{ad.title}</h3>
          <button className="ad-button">{ad.cta}</button>
        </div>
      </div>
    )
  }

  return null
}
