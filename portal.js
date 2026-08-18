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
document.addEventListener('DOMContentLoaded', mountBrand)
