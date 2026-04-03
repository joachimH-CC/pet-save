let BASE_API = '' //请求前缀
let HOST = '' //域名

if (process.env.NODE_ENV === 'development') {
	HOST = "http://localhost:11297"
	BASE_API = ""
}
if (process.env.NODE_ENV === 'production') {
	HOST = "http://localhost:11297"
	BASE_API = ""
}

const BASE_URL = HOST + BASE_API

export default {
	BASE_URL,
	HOST,
	BASE_API
}
