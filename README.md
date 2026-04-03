# 🐾 Pet-Save - Pet Adoption & Rescue Platform

A comprehensive uni-app based platform designed to optimize pet adoption and rescue efficiency through intelligent matching, community engagement, and seamless digital workflows.

## ✨ Key Features

### Core Functionality
- **🔍 Pet Browse & Filter** - Comprehensive pet catalog with advanced filtering capabilities
- **📝 Adoption Application** - Streamlined adoption process with digital forms
- **💬 Real-time Chat** - WebSocket-based instant messaging between adopters and rescuers
- **📜 E-signature Contracts** - Electronic contract signing for adoption agreements
- **🤖 AI Smart Matching** - Intelligent pet-to-adopter matching based on preferences
- **📊 Data Visualization** - Analytics dashboard for adoption metrics
- **🏥 Care Records** - Pet healthcare tracking (feeding, vaccines, medical history)
- **📱 Community** - Social platform for pet knowledge sharing
- **🔔 Message Center** - Unified notifications for adoption status

## 🏗️ Technology Stack
- **Framework**: uni-app (Vue 2.x)
- **UI Library**: uView 2.0
- **State Management**: Vuex
- **Real-time Communication**: WebSocket with auto-reconnect
- **HTTP Client**: Custom wrapper with interceptors
- **Storage**: uni.setStorageSync (Local Storage)
- **Supported Platforms**: iOS, Android, WeChat Mini Program, Web (H5)

## 📁 Project Structure
```
pet-save/
├── pages/                    # Application pages
│   ├── index/               # Home page
│   ├── login/              # Login page
│   ├── community/          # Community posts
│   ├── info/               # Message center
│   ├── user/               # User profile
│   └── [sub-packages]/     # Feature modules
├── utils/                   # Utility functions
│   ├── auth.js             # Token management
│   ├── env.js              # Environment config
│   ├── request.js          # HTTP wrapper
│   └── websocket.js        # WebSocket client
├── store/                   # Vuex store (state management)
├── interceptor/             # Route & request guards
├── App.vue                  # Root component
└── main.js                  # Application entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 12.0
- npm or yarn
- HBuilderX or CLI environment

### Installation
```bash
git clone https://github.com/joachimH-CC/pet-save.git
cd pet-save
npm install
```

### Development
```bash
# Run with HBuilderX or
npm run dev

# Build for production
npm run build
```

### Configuration
Update `utils/env.js` with your backend API endpoint:
```javascript
if (process.env.NODE_ENV === 'development') {
  HOST = "http://localhost:11297"
}
```

## 🔐 Authentication System

Token-based authentication with automatic management:
```javascript
import { setToken, getToken, removeToken, hasToken } from '@/utils/auth.js'

setToken(token)           // Store token
const token = getToken()  // Retrieve token
removeToken()             // Clear on logout
hasToken()                // Check authentication
```

## 💬 Real-time Chat with WebSocket

Robust WebSocket implementation with auto-reconnect:
```javascript
import WebSocketClient from '@/utils/websocket.js'

const ws = new WebSocketClient(url, {
  maxReconnectAttempts: 5,
  reconnectInterval: 3000
}, userId)

ws.on('message', (data) => console.log(data))
ws.send({ type: 'chat', content: 'Hello' })
ws.close()
```

Features:
- Auto-reconnection with exponential backoff
- Message queue for offline mode
- Token-based authentication
- Connection status tracking

## 📡 HTTP Request Wrapper

Custom HTTP client with automatic token injection:
```javascript
import http from '@/utils/request.js'

http({
  url: '/api/pets',
  method: 'GET',
  data: {},
  isToken: true  // Auto-inject Authorization header
}).then(res => {
  // Handle success
}).catch(err => {
  // Handle error
})
```

Features:
- Automatic token injection
- 401 error handling (auto-redirect to login)
- Global error notifications
- Response status code validation

## 🎮 State Management (Vuex)

Global state includes:
- `roleId` - User role (0-1: adopter, 2: rescue org)
- `petSize` - Pet size categories (small, medium, large)
- `nurseType` - Care types (feeding, medication, vaccination, etc.)
- `isAiMatch` - AI matching preference flag

Usage:
```javascript
import store from '@/store/index.js'

store.commit('setRole', roleId)
store.dispatch('initRole')
```

## 🛡️ Route Protection

Navigation guards ensure unauthenticated users cannot access protected pages:
- **Whitelist Pages**: `/pages/login/login`, `/pages/index/index`
- **Protected Pages**: Require valid token; auto-redirect to login
- **Interceptors**: Applied to `navigateTo` and `switchTab`

## 📊 Data Models

### Role Types
- 0-1: Adopter / General User
- 2: Rescue Organization

### Pet Care Types
- 0: Feeding (喂食)
- 1: Medication (换药)
- 2: Vaccination (注射疫苗)
- 3: Deworming (驱虫)
- 4: Sterilization (绝育)
- 5: Other (其他)

### Pet Sizes
- 0: Small (小型)
- 1: Medium (中型)
- 2: Large (大型)

## 🔗 API Integration

Backend API endpoints (configurable in `utils/env.js`):
- `/api/auth/*` - Authentication & login
- `/api/pets/*` - Pet management
- `/api/adoption/*` - Adoption applications
- `/api/posts/*` - Community posts
- `/api/messages/*` - Messaging
- `/ws/*` - WebSocket endpoints

## 📝 File Descriptions

| File | Purpose |
|------|---------|
| `utils/auth.js` | Token storage and retrieval |
| `utils/env.js` | Environment and API configuration |
| `utils/request.js` | HTTP client with interceptors |
| `utils/websocket.js` | WebSocket client with reconnect logic |
| `store/index.js` | Vuex store for global state |
| `interceptor/routerInter.js` | Navigation guards |
| `pages.json` | Route configuration and subpackages |
| `manifest.json` | App metadata and permissions |

## ⚙️ Build Configuration

- **Entry**: `main.js`
- **HTML**: `index.html`
- **Styles**: SCSS with uView theme
- **Vue Version**: 2.x
- **Sub-packages**: Enabled for code splitting
- **Custom TabBar**: Enabled

## 📦 Dependencies
- `uview-ui@^2.0.38` - UI component library for uni-app

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

**Note**: Test across multiple platforms (iOS, Android, Mini Programs) before submitting PRs.

## 📄 License
ISC License

## 📞 Support
For issues and questions, please open a GitHub issue or contact the development team.

---

**Last Updated**: 2026-04-03** 09:18:50 **
**Repository**: [joachimH-CC/pet-save](https://github.com/joachimH-CC/pet-save)
**Maintained By**: joachimH-CC
