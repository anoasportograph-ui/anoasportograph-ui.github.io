// Portal Anoa's Uploader — helper bersama
const API = 'https://anoa-otp.anoasportograph.workers.dev'
const WA = '6285825447704'

const U2 = `<svg class="logo" viewBox="0 0 1024 1024" aria-hidden="true"><defs>
  <linearGradient id="gv" x1="0" y1="100" x2="0" y2="924" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#6a5cf2"/><stop offset="1" stop-color="#4234c9"/></linearGradient></defs>
  <rect x="100" y="100" width="824" height="824" rx="188" fill="url(#gv)"/>
  <path d="M360 470 V598 C 360 690 426 732 512 732 C 598 732 664 690 664 598 V470" fill="none" stroke="#fff" stroke-width="60" stroke-linecap="round"/>
  <path d="M512 320 L612 432 H556 V600 H468 V432 H412 Z" fill="#fff"/></svg>`

const getToken = () => localStorage.getItem('au_session')
const setToken = (t) => localStorage.setItem('au_session', t)
const clearToken = () => localStorage.removeItem('au_session')

async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body) headers['content-type'] = 'application/json'
  if (auth) headers['authorization'] = 'Bearer ' + (getToken() || '')
  const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

// isi elemen .brand dgn logo + nama
function mountBrand() {
  document.querySelectorAll('.brand[data-logo]').forEach((el) => { el.innerHTML = U2 + ' Anoa\'s Uploader' })
}

// penghitung kunjungan → isi elemen #visit-counter (increment sekali per sesi)
const _MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
async function mountVisits() {
  const el = document.getElementById('visit-counter')
  if (!el) return
  try {
    const inc = !sessionStorage.getItem('au_visited')
    const r = await fetch(API + (inc ? '/api/visit' : '/api/visits'), inc ? { method: 'POST' } : {})
    if (inc) sessionStorage.setItem('au_visited', '1')
    const d = await r.json()
    const [y, mo, dd] = d.day.split('-')
    el.innerHTML = '📊 ' + parseInt(dd) + ' ' + _MONTHS[parseInt(mo) - 1] + ' ' + y +
      ' · <b>' + d.total.toLocaleString('id-ID') + '</b> kunjungan' +
      ' · <span style="opacity:.7">hari ini ' + d.today.toLocaleString('id-ID') + '</span>'
  } catch (e) { /* diam */ }
}

// odometer total file sepanjang masa (dari AU CC via Worker) → isi #odo-counter.
// Kalau belum ada data (0) atau gagal, biarkan angka placeholder di HTML.
async function mountOdometer() {
  const el = document.getElementById('odo-counter')
  if (!el) return
  try {
    const r = await fetch(API + '/api/odometer')
    const d = await r.json()
    if (d && d.total > 0) {
      el.textContent = d.total.toLocaleString('id-ID') + '+'
      const lab = document.getElementById('odo-label')
      if (lab) lab.textContent = 'foto sudah diunggah'
    }
  } catch (e) { /* diam → pakai placeholder */ }
}

document.addEventListener('DOMContentLoaded', () => { mountBrand(); mountVisits(); mountOdometer() })
