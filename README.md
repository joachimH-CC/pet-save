# 🐾 Pet-Save - 宠物领养与救助平台

一个基于 uni-app 的综合性平台，通过智能匹配、社区互动和无缝数字化工作流，优化宠物领养和救助效率。

## ✨ 核心功能

### 主要功能
- **🔍 宠物浏览与筛选** - 提供全面的宠物目录，支持高级筛选功能
- **📝 领养申请** - 简化领养流程，支持数字化表单
- **💬 实时聊天** - 基于 WebSocket 的即时通讯，连接领养者与救助人员
- **📜 电子签名合同** - 领养协议的电子合同签署
- **🤖 AI 智能匹配** - 基于偏好的智能宠物与领养者匹配
- **📊 数据可视化** - 领养指标分析仪表板
- **🏥 护理记录** - 宠物健康跟踪（喂食、疫苗、病历）
- **📱 社区** - 宠物知识分享社交平台
- **🔔 消息中心** - 领养状态统一通知

## 🏗️ 技术栈
- **框架**: uni-app（Vue 2.x）
- **UI 库**: uView 2.0
- **状态管理**: Vuex
- **实时通信**: WebSocket（支持自动重连）
- **HTTP 客户端**: 自定义封装（含拦截器）
- **存储**: uni.setStorageSync（本地存储）
- **支持平台**: iOS、Android、微信小程序、Web（H5）

## 📁 项目结构
```
pet-save/
├── pages/                    # 应用页面
│   ├── index/               # 首页
│   ├── login/              # 登录页
│   ├── community/          # 社区帖子
│   ├── info/               # 消息中心
│   ├── user/               # 用户中心
│   └── [sub-packages]/     # 功能模块
├── utils/                   # 工具函数
│   ├── auth.js             # Token 管理
│   ├── env.js              # 环境配置
│   ├── request.js          # HTTP 封装
│   └── websocket.js        # WebSocket 客户端
├── store/                   # Vuex 状态管理
├── interceptor/             # 路由与请求守卫
├── App.vue                  # 根组件
└── main.js                  # 应用入口
```

## 🚀 快速开始

### 前置条件
- Node.js >= 12.0
- npm 或 yarn
- HBuilderX 或 CLI 环境

### 安装
```bash
git clone https://github.com/joachimH-CC/pet-save.git
cd pet-save
npm install
```

### 开发
```bash
# 使用 HBuilderX 运行，或执行
npm run dev

# 构建生产版本
npm run build
```

### 配置
在 `utils/env.js` 中更新后端 API 地址：
```javascript
if (process.env.NODE_ENV === 'development') {
  HOST = "http://localhost:11297"
}
```

## 🔐 身份验证系统

基于 Token 的身份验证，支持自动管理：
```javascript
import { setToken, getToken, removeToken, hasToken } from '@/utils/auth.js'

setToken(token)           // 存储 Token
const token = getToken()  // 获取 Token
removeToken()             // 登出时清除
hasToken()                // 检查登录状态
```

## 💬 WebSocket 实时聊天

健壮的 WebSocket 实现，支持自动重连：
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

功能特性：
- 带指数退避的自动重连
- 离线模式消息队列
- 基于 Token 的身份验证
- 连接状态追踪

## 📡 HTTP 请求封装

自定义 HTTP 客户端，支持自动注入 Token：
```javascript
import http from '@/utils/request.js'

http({
  url: '/api/pets',
  method: 'GET',
  data: {},
  isToken: true  // 自动注入 Authorization 请求头
}).then(res => {
  // 处理成功
}).catch(err => {
  // 处理错误
})
```

功能特性：
- 自动注入 Token
- 401 错误处理（自动跳转登录页）
- 全局错误通知
- 响应状态码校验

## 🎮 状态管理（Vuex）

全局状态包括：
- `roleId` - 用户角色（0-1：领养者，2：救助机构）
- `petSize` - 宠物体型分类（小型、中型、大型）
- `nurseType` - 护理类型（喂食、换药、注射疫苗等）
- `isAiMatch` - AI 匹配偏好标志

使用方式：
```javascript
import store from '@/store/index.js'

store.commit('setRole', roleId)
store.dispatch('initRole')
```

## 🛡️ 路由保护

导航守卫确保未认证用户无法访问受保护页面：
- **白名单页面**: `/pages/login/login`、`/pages/index/index`
- **受保护页面**: 需要有效 Token，否则自动跳转登录
- **拦截器**: 应用于 `navigateTo` 和 `switchTab`

## 📊 数据模型

### 角色类型
- 0-1：领养者 / 普通用户
- 2：救助机构

### 宠物护理类型
- 0: 喂食
- 1: 换药
- 2: 注射疫苗
- 3: 驱虫
- 4: 绝育
- 5: 其他

### 宠物体型
- 0: 小型
- 1: 中型
- 2: 大型

## 🔗 API 集成

后端 API 地址（可在 `utils/env.js` 中配置）：
- `/api/auth/*` - 身份验证与登录
- `/api/pets/*` - 宠物管理
- `/api/adoption/*` - 领养申请
- `/api/posts/*` - 社区帖子
- `/api/messages/*` - 消息通讯
- `/ws/*` - WebSocket 接口

## 📝 文件说明

| 文件 | 用途 |
|------|---------|
| `utils/auth.js` | Token 存储与读取 |
| `utils/env.js` | 环境与 API 配置 |
| `utils/request.js` | 含拦截器的 HTTP 客户端 |
| `utils/websocket.js` | 含重连逻辑的 WebSocket 客户端 |
| `store/index.js` | 全局状态的 Vuex store |
| `interceptor/routerInter.js` | 导航守卫 |
| `pages.json` | 路由配置与分包 |
| `manifest.json` | 应用元数据与权限 |

## ⚙️ 构建配置

- **入口**: `main.js`
- **HTML**: `index.html`
- **样式**: SCSS（使用 uView 主题）
- **Vue 版本**: 2.x
- **分包**: 已启用（代码分割）
- **自定义 TabBar**: 已启用

## 📦 依赖项
- `uview-ui@^2.0.38` - uni-app UI 组件库

## 🤝 贡献指南
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "Add feature"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

**注意**：提交 PR 前请在多个平台（iOS、Android、小程序）上进行测试。

## 📄 许可证
ISC 许可证

## 📞 支持
如有问题或疑问，请在 GitHub 上提交 Issue 或联系开发团队。

---

**最后更新**: 2026-04-03** 09:18:50 **
**仓库地址**: [joachimH-CC/pet-save](https://github.com/joachimH-CC/pet-save)
**维护者**: joachimH-CC
