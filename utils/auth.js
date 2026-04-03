const key = "pet-token"
export function setToken(value) {
	uni.setStorageSync(key, value)
}

export function getToken() {
	return uni.getStorageSync(key)
}

export function removeToken() {
	uni.removeStorageSync(key)
}

export function hasToken() {
	return getToken()
}