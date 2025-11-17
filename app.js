// --- Local storage helpers ---
const LS_KEY = "lfu_sellers";
function loadSellersFromStorage() {
  const saved = localStorage.getItem(LS_KEY);
  return saved ? JSON.parse(saved) : [];
}
function saveSellers(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

// --- State ---
let sellers = [];
let markers = [];
let map;
let sellersLayer;

// --- Load sellers from JSON file ---
async function loadSellersFromFile() {
  try {
    const res = await fetch("sellers.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    sellers = data;

    // Додаємо продавців з localStorage (якщо є)
    const stored = loadSellersFromStorage();
    if (stored.length) {
      sellers = [...sellers, ...stored];
    }

    renderMarkers();
  } catch (err) {
    console.error("Помилка завантаження sellers.json", err);
    sellers = [];
    renderMarkers();
  }
}

// --- Toast повідомлення ---
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// --- Map init ---
function initMap() {
  map = L.map("map", { zoomControl: true }).setView([48.9226, 24.7111], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    const latInput = document.getElementById("sellerLat");
    const lngInput = document.getElementById("sellerLng");
    if (latInput && lngInput) {
      latInput.value = lat.toFixed(6);
      lngInput.value = lng.toFixed(6);
    }
  });

  sellersLayer = L.layerGroup().addTo(map);
}

// --- Render markers with filters/search ---
function renderMarkers() {
  sellersLayer.clearLayers();
  markers = [];

  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const category = (document.getElementById("categoryFilter")?.value || "");

  const filtered = sellers.filter((s) => {
    const matchesText =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.product?.toLowerCase().includes(q) ||
      (s.city || "").toLowerCase().includes(q);
    const matchesCategory = !category || s.category === category;
    return matchesText && matchesCategory;
  });

  if (filtered.length === 0) {
    showToast("😕 Нічого не знайдено");
    return;
  } else {
    showToast(`🔎 Знайдено ${filtered.length} продавців`);
    // Пересунути карту до першого співпадіння
    const first = filtered[0];
    map.setView([first.lat, first.lng], 13);
  }

  filtered.forEach((s) => {
    const marker = L.marker([s.lat, s.lng], { title: `${s.name} — ${s.product}` });
    const popupHtml = `
      <div style="min-width:220px">
        <strong>${s.name}</strong><br/>
        <span>${s.product} (${s.category})</span><br/>
        <span>${s.price || ""}</span><br/>
        <span>${s.city ? "📍 " + s.city : ""}</span><br/>
        <div style="margin-top:6px">
          <a href="tel:${extractPhone(s.contact)}" style="margin-right:8px">📞 Дзвінок</a>
          <a href="${makeMessengerLink(s.contact)}" target="_blank">✉️ Написати</a>
        </div>
        <div style="margin-top:6px;color:#666;font-size:12px">${s.contact}</div>
      </div>
    `;
    marker.bindPopup(popupHtml).addTo(sellersLayer);
    markers.push(marker);
  });
}

// --- Helpers for contact links ---
function extractPhone(contact) {
  const m = contact.match(/(\+?\d[\d\s-]{7,})/);
  return m ? m[1].replace(/\s|-/g, "") : "";
}
function makeMessengerLink(contact) {
  const tg = contact.match(/@([A-Za-z0-9_]+)/);
  if (tg) return `https://t.me/${tg[1]}`;
  const viber = extractPhone(contact);
  if (viber) return `viber://chat?number=${encodeURIComponent(viber)}`;
  return "javascript:void(0)";
}

// --- Search, filter, geolocate ---
function setupUI() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  // Пошук при вводі символів
  searchInput.addEventListener("input", renderMarkers);

  // Пошук при натисканні Enter
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      renderMarkers();
    }
  });

  categoryFilter.addEventListener("change", renderMarkers);

  document.getElementById("locateBtn").addEventListener("click", () => {
    if (!navigator.geolocation) return alert("Геолокація недоступна у цьому браузері.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        L.circleMarker([latitude, longitude], {
          radius: 6,
          color: "#2a7e3b",
          fillColor: "#2a7e3b",
          fillOpacity: 0.8
        }).addTo(map).bindPopup("Моє місцезнаходження");
      },
      () => alert("Не вдалося отримати геолокацію.")
    );
  });

  // Modal open/close
  const modal = document.getElementById("addSellerModal");
  document.getElementById("addSellerBtn").addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "false");
  });
  document.getElementById("closeModal").addEventListener("click", () => {
    modal.setAttribute("aria-hidden", "true");
  });

  // Use my location in form
  document.getElementById("useMyLocation").addEventListener("click", () => {
    if (!navigator.geolocation) return alert("Геолокація недоступна.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById("sellerLat").value = pos.coords.latitude.toFixed(6);
        document.getElementById("sellerLng").value = pos.coords.longitude.toFixed(6);
      },
      () => alert("Не вдалося отримати геолокацію.")
    );
  });

  // Form submit
  document.getElementById("sellerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("sellerName").value.trim();
    const product = document.getElementById("sellerProduct").value.trim();
    const category = document.getElementById("sellerCategory").value;
    const price = document.getElementById("sellerPrice").value.trim();
    const contact = document.getElementById("sellerContact").value.trim();
    const city = document.getElementById("sellerCity").value.trim();
    const lat = parseFloat(document.getElementById("sellerLat").value);
    const lng = parseFloat(document.getElementById("sellerLng").value);

    const errors = [];
    if (!name) errors.push("Ім’я є обов’язковим.");
    if (!product) errors.push("Вкажіть продукцію.");
    if (!category) errors.push("Оберіть категорію.");
    if (!contact) errors.push("Вкажіть контакт.");
    if (Number.isNaN(lat) || Number.isNaN(lng)) errors.push("Невірні координати.");

    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    const newSeller = {
      id: "s" + Date.now(),
      name, product, category, price, contact, city, lat, lng
    };

    sellers.push(newSeller);
    saveSellers(sellers);
    document.getElementById("addSellerModal").setAttribute("aria-hidden", "true");
    e.target.reset();
    renderMarkers();
  });
}

// --- Boot ---
window.addEventListener("DOMContentLoaded", () => {
    initMap();
    setupUI();
    loadSellersFromFile();
});
  