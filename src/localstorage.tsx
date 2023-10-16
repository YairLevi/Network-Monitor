export function getNameAndAddress() {
  return {
    name: window.localStorage.getItem('name'),
    address: window.localStorage.getItem('address')
  }
}

export function setNameAndAddress(name: string, address: string) {
  window.localStorage.setItem('name', name)
  window.localStorage.setItem('address', address)
}

export function cleanLocalStorage() {
  window.localStorage.removeItem('name')
  window.localStorage.removeItem('address')
}
