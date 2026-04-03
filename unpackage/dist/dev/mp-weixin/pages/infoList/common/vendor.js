(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/infoList/common/vendor"],{

/***/ 347:
/*!*********************************************************************!*\
  !*** D:/DevelopProject/HbuilerXProject/petAdopt/utils/websocket.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _env = _interopRequireDefault(__webpack_require__(/*! ./env.js */ 175));
var _auth = __webpack_require__(/*! ./auth.js */ 38);
/**
 * WebSocket类封装（uni-app版）
 * 用于在chat.vue中实现实时聊天功能
 */
var WebSocketClient = /*#__PURE__*/function () {
  function WebSocketClient() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var userId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    (0, _classCallCheck2.default)(this, WebSocketClient);
    // 默认WebSocket URL
    this.url = url || this.getWebSocketUrl(userId);
    this.options = options;
    this.socketTask = null;
    this.isConnected = false;
    this.isConnecting = false; // 添加连接中状态
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.messageQueue = [];
    this.socketId = null;
    this.userId = userId;
    this.isManualClose = false; // 添加手动关闭标志

    // 事件回调函数
    this.onOpen = options.onOpen || function () {};
    this.onMessage = options.onMessage || function () {};
    this.onError = options.onError || function () {};
    this.onClose = options.onClose || function () {};
    this.onReconnectAttempt = options.onReconnectAttempt || function () {};
  }

  /**
   * 获取WebSocket URL
   * 基于项目的环境配置生成WebSocket URL
   */
  (0, _createClass2.default)(WebSocketClient, [{
    key: "getWebSocketUrl",
    value: function getWebSocketUrl(userId) {
      // 将HTTP URL转换为WebSocket URL
      var wsProtocol = 'ws://';
      var host = _env.default.HOST.replace('http://', '');

      // 如果是HTTPS，则使用wss协议
      if (_env.default.HOST.startsWith('https://')) {
        wsProtocol = 'wss://';
        host = _env.default.HOST.replace('https://', '');
      }
      console.log('WebSocket URL:', "".concat(wsProtocol).concat(host, "/ws/").concat(userId));
      return "".concat(wsProtocol).concat(host, "/ws/").concat(userId);
    }

    /**
     * 连接WebSocket服务器（使用uni-app API）
     */
  }, {
    key: "connect",
    value: function connect() {
      var _this = this;
      // 防止重复连接
      if (this.isConnecting || this.isConnected) {
        console.log('WebSocket已经在连接中或已连接');
        return;
      }
      try {
        this.isConnecting = true;

        // 验证URL有效性
        if (!this.url) {
          this.url = this.getWebSocketUrl(this.userId);
          if (!this.url) {
            this.isConnecting = false;
            return;
          }
        }

        // 创建WebSocket连接，带上token作为身份验证
        var token = (0, _auth.getToken)();
        var wsUrl = token ? "".concat(this.url, "?token=").concat(token) : this.url;

        // 使用uni-app的connectSocket API
        this.socketTask = uni.connectSocket({
          url: wsUrl,
          success: function success() {
            console.log('WebSocket连接请求已发送');
          },
          fail: function fail(err) {
            console.error('WebSocket连接请求发送失败:', err);
            _this.onError(err);
            _this.isConnecting = false;
            _this.attemptReconnect();
          }
        });

        // WebSocket事件处理（使用uni-app的事件监听）
        this.socketTask.onOpen(this.handleOpen.bind(this));
        this.socketTask.onMessage(this.handleMessage.bind(this));
        this.socketTask.onError(this.handleError.bind(this));
        this.socketTask.onClose(this.handleClose.bind(this));
      } catch (error) {
        console.error('WebSocket连接失败:', error);
        this.onError(error);
        this.isConnecting = false;
        this.attemptReconnect();
      }
    }

    /**
     * 发送消息（使用uni-app API）
     */
  }, {
    key: "send",
    value: function send(data) {
      var _this2 = this;
      if (this.isConnected && this.socketTask) {
        try {
          // 如果连接已建立，直接发送消息
          var messageData = typeof data === 'string' ? data : JSON.stringify(data);
          this.socketTask.send({
            data: messageData,
            success: function success() {
              console.log('消息发送成功');
            },
            fail: function fail(err) {
              console.error('消息发送失败:', err);
              // 发送失败时，将消息加入队列
              _this2.messageQueue.push(data);
            }
          });
        } catch (error) {
          console.error('消息发送处理失败:', error);
          this.messageQueue.push(data);
        }
      } else {
        // 如果连接未建立，将消息加入队列，等待连接建立后发送
        this.messageQueue.push(data);
        // 如果还没有连接，尝试连接
        if (!this.isConnected && !this.isConnecting) {
          this.connect();
        }
      }
    }

    /**
     * 关闭WebSocket连接（使用uni-app API）
     */
  }, {
    key: "close",
    value: function close() {
      // 设置为手动关闭，避免触发重连
      this.isManualClose = true;

      // 重置状态
      this.isConnected = false;
      this.isConnecting = false;

      // 清除重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      // 关闭连接
      if (this.socketTask) {
        try {
          this.socketTask.close();
        } catch (error) {
          console.error('WebSocket关闭失败:', error);
        }
        this.socketTask = null;
      }
    }

    /**
     * 处理连接打开事件
     */
  }, {
    key: "handleOpen",
    value: function handleOpen(event) {
      console.log('WebSocket连接已打开');
      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.onOpen(event);

      // 发送队列中的消息
      this.flushMessageQueue();
    }

    /**
     * 处理接收到的消息
     */
  }, {
    key: "handleMessage",
    value: function handleMessage(event) {
      try {
        // 尝试将消息解析为JSON
        var data = JSON.parse(event.data);
        this.onMessage(data);
      } catch (error) {
        // 如果解析失败，直接返回原始消息
        this.onMessage(event.data);
      }
    }

    /**
     * 处理错误事件
     */
  }, {
    key: "handleError",
    value: function handleError(event) {
      console.error('WebSocket错误:', event);
      this.isConnecting = false;
      this.onError(event);
    }

    /**
     * 处理连接关闭事件
     */
  }, {
    key: "handleClose",
    value: function handleClose(event) {
      console.log('WebSocket连接已关闭', event);
      this.isConnected = false;
      this.isConnecting = false;
      this.socketTask = null;
      this.onClose(event);

      // 只有在非手动关闭的情况下才尝试重连
      if (!this.isManualClose) {
        this.attemptReconnect();
      }
    }

    /**
     * 尝试重新连接
     */
  }, {
    key: "attemptReconnect",
    value: function attemptReconnect() {
      var _this3 = this;
      // 如果已经达到最大重连次数，则停止重连
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('达到最大重连次数，停止重连');
        return;
      }
      this.reconnectAttempts++;
      var attemptMessage = "\u7B2C".concat(this.reconnectAttempts, "\u6B21\u5C1D\u8BD5\u91CD\u8FDE...");
      console.log(attemptMessage);
      this.onReconnectAttempt(attemptMessage);

      // 清除之前的重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      // 指数退避策略，增加重连间隔时间
      var currentReconnectInterval = this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);

      // 设置重连定时器
      this.reconnectTimer = setTimeout(function () {
        // 再次验证状态
        if (!_this3.isConnected && !_this3.isConnecting) {
          _this3.connect();
        }
      }, currentReconnectInterval);
    }

    /**
     * 发送队列中的消息
     */
  }, {
    key: "flushMessageQueue",
    value: function flushMessageQueue() {
      var _this4 = this;
      // 创建队列副本，避免在发送过程中修改原队列
      var queueCopy = (0, _toConsumableArray2.default)(this.messageQueue);
      this.messageQueue = [];
      queueCopy.forEach(function (message) {
        if (_this4.isConnected && _this4.socketTask) {
          _this4.send(message);
        } else {
          // 如果连接在发送过程中断开，将消息放回队列
          _this4.messageQueue.push(message);
        }
      });
    }

    /**
     * 获取连接状态
     */
  }, {
    key: "getConnectionStatus",
    value: function getConnectionStatus() {
      return {
        isConnected: this.isConnected,
        isConnecting: this.isConnecting,
        reconnectAttempts: this.reconnectAttempts,
        maxReconnectAttempts: this.maxReconnectAttempts
      };
    }

    /**
     * 重新初始化连接
     * 用于需要完全重置连接的场景
     */
  }, {
    key: "reinitialize",
    value: function reinitialize() {
      this.close();
      // 重置手动关闭标志，以便重新连接
      this.isManualClose = false;
      this.reconnectAttempts = 0;
      this.messageQueue = [];
      this.url = this.getWebSocketUrl(this.userId);
      this.connect();
    }

    /**
     * 设置事件回调函数
     */
  }, {
    key: "on",
    value: function on(event, callback) {
      switch (event) {
        case 'open':
          this.onOpen = callback;
          break;
        case 'message':
          this.onMessage = callback;
          break;
        case 'error':
          this.onError = callback;
          break;
        case 'close':
          this.onClose = callback;
          break;
        case 'reconnectAttempt':
          this.onReconnectAttempt = callback;
          break;
        default:
          console.warn("\u672A\u77E5\u4E8B\u4EF6\u7C7B\u578B: ".concat(event));
      }
    }
  }]);
  return WebSocketClient;
}();
var _default = WebSocketClient;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ })

}]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/infoList/common/vendor.js.map